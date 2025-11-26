/**
 * Refresh Google Analytics OAuth Token
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import mongoose from 'mongoose';

// Load environment variables synchronously before anything else
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

async function refreshToken() {
  // Initialize encryption key inside the function
  const ENCRYPTION_KEY = Buffer.from(process.env.PLATFORM_CREDENTIALS_ENCRYPTION_KEY!, 'hex');

  function encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  function decrypt(encrypted: string, iv: string, authTag: string) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB');

  const conn = await mongoose.connection.db!.collection('platformconnections').findOne({
    platformId: 'google-analytics',
    status: 'active',
  });

  if (!conn) {
    console.log('No connection found');
    await mongoose.disconnect();
    return;
  }

  console.log('Found connection, attempting refresh...');
  console.log('Current expiry:', conn.expiresAt);

  const refreshTokenDecrypted = decrypt(conn.encryptedRefreshToken, conn.refreshTokenIV, conn.refreshTokenAuthTag);

  // Exchange refresh token for new access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshTokenDecrypted,
      client_id: process.env.GOOGLE_ANALYTICS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ANALYTICS_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.log('Refresh failed:', err);
    await mongoose.disconnect();
    return;
  }

  const data = await response.json();
  console.log('Got new access token, updating database...');

  // Encrypt the new token
  const encrypted = encrypt(data.access_token);

  // Update directly in MongoDB
  await mongoose.connection.db!.collection('platformconnections').updateOne(
    { _id: conn._id },
    {
      $set: {
        encryptedAccessToken: encrypted.encrypted,
        accessTokenIV: encrypted.iv,
        accessTokenAuthTag: encrypted.authTag,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    }
  );

  console.log('✅ Token refreshed successfully!');
  console.log('New expiry:', new Date(Date.now() + data.expires_in * 1000));

  await mongoose.disconnect();
}

refreshToken().catch(console.error);
