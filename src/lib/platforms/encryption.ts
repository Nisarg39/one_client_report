/**
 * Encryption Utilities
 *
 * AES-256-GCM encryption for securing platform credentials
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

/**
 * Get encryption key from environment
 * @throws Error if key is not set or invalid
 */
function getEncryptionKey(): Buffer {
  const key = process.env.PLATFORM_CREDENTIALS_ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      'PLATFORM_CREDENTIALS_ENCRYPTION_KEY environment variable is not set'
    );
  }

  // Key should be 32 bytes (64 hex characters) for AES-256
  if (key.length !== 64) {
    throw new Error(
      'PLATFORM_CREDENTIALS_ENCRYPTION_KEY must be 64 hex characters (32 bytes)'
    );
  }

  return Buffer.from(key, 'hex');
}

/**
 * Generate a random encryption key (for setup)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Encrypt a token using AES-256-GCM
 *
 * @param token - The token to encrypt
 * @returns Encrypted data with IV and auth tag
 */
export function encryptToken(token: string): EncryptedData {
  if (!token) {
    throw new Error('Token is required for encryption');
  }

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt a token using AES-256-GCM
 *
 * @param data - Encrypted data with IV and auth tag
 * @returns Decrypted token
 */
export function decryptToken(data: EncryptedData): string {
  if (!data.encrypted || !data.iv || !data.authTag) {
    throw new Error('Invalid encrypted data structure');
  }

  try {
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(data.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));

    let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Validate encryption key format
 *
 * @param key - Hex string key to validate
 * @returns True if valid
 */
export function validateEncryptionKey(key: string): boolean {
  if (!key || typeof key !== 'string') {
    return false;
  }

  // Must be 64 hex characters (32 bytes for AES-256)
  if (key.length !== 64) {
    return false;
  }

  // Must be valid hex
  return /^[0-9a-f]{64}$/i.test(key);
}

/**
 * Encrypt multiple tokens at once
 *
 * @param tokens - Object with token values to encrypt
 * @returns Object with encrypted tokens
 */
export function encryptTokens(tokens: Record<string, string>): Record<
  string,
  EncryptedData
> {
  const encrypted: Record<string, EncryptedData> = {};

  for (const [key, value] of Object.entries(tokens)) {
    if (value) {
      encrypted[key] = encryptToken(value);
    }
  }

  return encrypted;
}

/**
 * Decrypt multiple tokens at once
 *
 * @param encryptedTokens - Object with encrypted token data
 * @returns Object with decrypted tokens
 */
export function decryptTokens(
  encryptedTokens: Record<string, EncryptedData>
): Record<string, string> {
  const decrypted: Record<string, string> = {};

  for (const [key, value] of Object.entries(encryptedTokens)) {
    if (value) {
      decrypted[key] = decryptToken(value);
    }
  }

  return decrypted;
}
