'use server';

import { requireAuth } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';

export async function updateAccountType(
  accountType: 'business' | 'education' | 'instructor'
) {
  try {
    const user = await requireAuth();
    await connectDB();

    const restrictions = getDefaultRestrictions(accountType);

    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      {
        accountType,
        usageTier: accountType === 'education' ? 'student' : 'pro',
        restrictions
      },
      { new: true }
    );

    if (!updatedUser) {
      return { success: false, error: 'User not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('[Update Account Type] Error:', error);
    return { success: false, error: 'Failed to update account type' };
  }
}

function getDefaultRestrictions(accountType: string) {
  if (accountType === 'education') {
    return {
      maxClients: 5,
      maxMessagesPerDay: 50,  // 50 messages/day forever for students
      maxConversations: 999999, // Unlimited conversations
      allowRealAPIs: false,
      allowedAgents: [],
      aiModel: 'gpt-3.5-turbo'
    };
  }

  // Business/Instructor defaults - Professional tier (trial enforces 50 msg/day separately)
  return {
    maxClients: 10,
    maxMessagesPerDay: 150,     // 150 messages/day; trial logic enforces 50/day limit
    maxConversations: 999999,
    allowRealAPIs: true,
    allowedAgents: [],
    aiModel: 'gpt-3.5-turbo'
  };
}
