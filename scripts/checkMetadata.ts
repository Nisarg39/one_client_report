import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';
import mongoose from 'mongoose';

async function checkMetadata() {
    await connectDB();
    const connections = await PlatformConnectionModel.find({ platformId: 'google-ads' });
    console.log(`Found ${connections.length} Google Ads connections:`);
    connections.forEach(conn => {
        console.log(`- Connection ID: ${conn._id}`);
        console.log(`  Client ID: ${conn.clientId}`);
        console.log(`  Metadata:`, JSON.stringify(conn.metadata, null, 2));
    });
    await mongoose.disconnect();
}

checkMetadata();
