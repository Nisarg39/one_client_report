import { connectDB } from '@/lib/db';
import PlatformConnectionModel from '@/models/PlatformConnection';
import mongoose from 'mongoose';

async function getToken() {
    await connectDB();
    const connection = await PlatformConnectionModel.findOne({ platformId: 'google-ads' });
    if (connection) {
        console.log('GOOGLE_ADS_ACCESS_TOKEN=' + connection.getDecryptedAccessToken());
    } else {
        console.log('No Google Ads connection found');
    }
    await mongoose.disconnect();
}

getToken();
