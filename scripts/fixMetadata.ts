import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';
import mongoose from 'mongoose';

async function fixMetadata() {
    await connectDB();
    const customerId = '2987039148'; // From screenshot

    // Update all Google Ads connections with this customer ID for testing
    const result = await PlatformConnectionModel.updateMany(
        { platformId: 'google-ads' },
        { $set: { 'metadata.customerId': customerId } }
    );

    console.log(`Updated ${result.modifiedCount} Google Ads connection(s) with customerId: ${customerId}`);

    await mongoose.disconnect();
}

fixMetadata();
