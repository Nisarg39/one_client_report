/**
 * Update User Profile Server Action
 *
 * Phase 6.6: Allows users to update their profile information
 * Updates name and notification preferences
 */

'use server';

import { z } from 'zod';
import UserModel from '@/models/User';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth/adapter';

/**
 * Input validation schema
 */
const notificationPreferencesSchema = z.object({
  email: z.object({
    enabled: z.boolean(),
    newMessages: z.boolean(),
    platformUpdates: z.boolean(),
    weeklyReports: z.boolean(),
    frequency: z.enum(['instant', 'daily', 'weekly']),
  }),
  inApp: z.object({
    enabled: z.boolean(),
  }),
});

const updateUserProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  notificationPreferences: notificationPreferencesSchema.optional(),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;

export interface UpdateUserProfileResult {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    notificationPreferences?: NotificationPreferences;
    updatedAt: string;
  };
  error?: string;
}

/**
 * Update user profile
 * Note: Name cannot be updated as it's managed by OAuth provider
 */
export async function updateUserProfile(
  data: UpdateUserProfileInput
): Promise<UpdateUserProfileResult> {
  try {
    // Validate input
    const validated = updateUserProfileSchema.parse(data);

    // Get authenticated user
    const authUser = await requireAuth();

    // Connect to database
    await connectDB();

    // Find user
    const user = await UserModel.findById(authUser.id);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Update notification preferences only
    // Note: Name is intentionally not updated as it's managed by OAuth provider
    if (validated.notificationPreferences) {
      user.notificationPreferences = validated.notificationPreferences;
    }

    // Save
    await user.save();

    // Convert to plain object to avoid Mongoose document serialization issues
    return {
      success: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        image: user.image,
        notificationPreferences: user.notificationPreferences ? {
          email: {
            enabled: user.notificationPreferences.email.enabled,
            newMessages: user.notificationPreferences.email.newMessages,
            platformUpdates: user.notificationPreferences.email.platformUpdates,
            weeklyReports: user.notificationPreferences.email.weeklyReports,
            frequency: user.notificationPreferences.email.frequency,
          },
          inApp: {
            enabled: user.notificationPreferences.inApp.enabled,
          },
        } : undefined,
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error('[updateUserProfile] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    };
  }
}
