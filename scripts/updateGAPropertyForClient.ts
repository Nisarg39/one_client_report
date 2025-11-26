/**
 * Update GA Property for a specific client connection
 */

import * as fs from 'fs';
import * as path from 'path';

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

import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';

async function updateProperty() {
  await connectDB();

  // Update the connection for the 'google demo data' client to use Flood-It!
  const result = await mongoose.connection.db!.collection('platformconnections').updateOne(
    { _id: new mongoose.Types.ObjectId('69264c358b13d9e846acae5c') },
    {
      $set: {
        'metadata.propertyId': '153293282',
        'metadata.propertyName': 'GA4 - Flood-It!'
      }
    }
  );

  console.log('Update result:', result);

  // Verify
  const updated = await mongoose.connection.db!.collection('platformconnections').findOne({
    _id: new mongoose.Types.ObjectId('69264c358b13d9e846acae5c')
  });

  console.log('\nUpdated connection:');
  console.log('  Property ID:', updated?.metadata?.propertyId);
  console.log('  Property Name:', updated?.metadata?.propertyName);

  await mongoose.disconnect();
}

updateProperty();
