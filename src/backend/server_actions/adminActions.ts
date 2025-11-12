'use server';

import {
  generateToken,
  createSessionCookie,
  deleteSessionCookie,
  getSessionToken,
  verifyToken
} from '../utils/session';
import { ServerActionResponse } from '../types';
import connectDB from '../config/database';
import Contactus from '../models/contactus';

type ContactStatus = 'unread' | 'read' | 'responded';

type ContactRecord = {
  _id: string | { toString(): string };
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  adminNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type SerializedContact = {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt?: string;
};

const serializeContact = (contact: ContactRecord): SerializedContact => ({
  _id: typeof contact._id === 'string' ? contact._id : contact._id.toString(),
  name: contact.name,
  email: contact.email,
  message: contact.message,
  status: contact.status,
  createdAt: contact.createdAt.toISOString(),
  updatedAt: contact.updatedAt?.toISOString(),
  adminNotes: contact.adminNotes ?? null,
});

/**
 * Admin login action
 * Validates password and creates JWT session cookie
 *
 * Flow:
 * 1. Get password from form
 * 2. Compare with ADMIN_PASSWORD env variable
 * 3. If correct:
 *    - Generate JWT token (signed with JWT_SECRET)
 *    - Create httpOnly cookie
 *    - Browser automatically stores it
 * 4. Return success/error
 *
 * @param formData - Form data containing password
 * @returns ServerActionResponse with success/error
 */
export async function adminLogin(
  formData: FormData
): Promise<ServerActionResponse> {
  try {
    // 1. Get password from form
    const password = formData.get('password')?.toString();

    // Validation
    if (!password) {
      return {
        success: false,
        message: 'Password is required',
      };
    }

    // 2. Verify password against env variable
    if (password !== process.env.ADMIN_PASSWORD) {
      return {
        success: false,
        message: 'Invalid password',
      };
    }

    // 3. Password correct! Generate JWT token
    // This creates a signed token with 24h expiry
    const token = generateToken();

    // 4. Create httpOnly cookie
    // This adds "Set-Cookie" header to response
    // Browser will automatically store it
    await createSessionCookie(token);

    // 5. Success!
    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      message: 'An error occurred during login',
    };
  }
}

/**
 * Admin logout action
 * Deletes the session cookie
 *
 * Flow:
 * 1. Delete admin-session cookie
 * 2. Browser removes it automatically
 * 3. User is logged out
 *
 * @returns ServerActionResponse with success/error
 */
export async function adminLogout(): Promise<ServerActionResponse> {
  try {
    await deleteSessionCookie();

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Admin logout error:', error);
    return {
      success: false,
      message: 'An error occurred during logout',
    };
  }
}

/**
 * Verify admin session
 * Checks if current user is authenticated
 *
 * Flow:
 * 1. Get token from cookie (browser sent it automatically)
 * 2. Verify JWT signature using JWT_SECRET
 * 3. Check if token expired
 * 4. Return true if valid, false if not
 *
 * Note: NO DATABASE QUERY! JWT is self-validating
 *
 * @returns boolean - true if authenticated, false otherwise
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    // 1. Get token from cookie
    const token = await getSessionToken();

    if (!token) {
      return false; // No cookie found
    }

    // 2. Verify JWT signature and expiry
    // This checks:
    // - Signature is valid (not tampered)
    // - Token not expired
    // - Token format is correct
    const isValid = verifyToken(token);

    return isValid;
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
  }
}

/**
 * Get dashboard statistics
 * Returns contact submission stats for overview dashboard
 *
 * @returns ServerActionResponse with stats data
 */
export async function getDashboardStats(): Promise<ServerActionResponse<{
  total: number;
  today: number;
  thisWeek: number;
  unread: number;
}>> {
  try {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, today, thisWeek, unread] = await Promise.all([
      Contactus.countDocuments(),
      Contactus.countDocuments({ createdAt: { $gte: todayStart } }),
      Contactus.countDocuments({ createdAt: { $gte: weekAgo } }),
      Contactus.countDocuments({ status: 'unread' }),
    ]);

    return {
      success: true,
      message: 'Stats fetched successfully',
      data: {
        total,
        today,
        thisWeek,
        unread,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      success: false,
      message: 'Failed to fetch dashboard stats',
    };
  }
}

/**
 * Get recent contact submissions
 * Returns latest 5 contact submissions for dashboard
 *
 * @returns ServerActionResponse with recent contacts
 */
export async function getRecentContacts(): Promise<ServerActionResponse<SerializedContact[]>> {
  try {
    await connectDB();

    const recentContacts = await Contactus.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean<ContactRecord>();

    // Serialize MongoDB documents to plain objects
    const serializedContacts = recentContacts.map(serializeContact);

    return {
      success: true,
      message: 'Recent contacts fetched successfully',
      data: serializedContacts,
    };
  } catch (error) {
    console.error('Error fetching recent contacts:', error);
    return {
      success: false,
      message: 'Failed to fetch recent contacts',
    };
  }
}

/**
 * Get all contacts with pagination, search, and filters
 *
 * @param page - Page number (default 1)
 * @param limit - Items per page (default 10)
 * @param search - Search query for name/email
 * @param status - Filter by status
 * @returns ServerActionResponse with paginated contacts
 */
export async function getAllContacts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<ServerActionResponse<{
  contacts: SerializedContact[];
  total: number;
  page: number;
  totalPages: number;
}>> {
  try {
    await connectDB();

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search || '';
    const status = params?.status || '';

    // Build query
    const query: Record<string, unknown> = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get total count
    const total = await Contactus.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get paginated results
    const contacts = await Contactus.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ContactRecord>();

    // Serialize contacts
    const serializedContacts = contacts.map(serializeContact);

    return {
      success: true,
      message: 'Contacts fetched successfully',
      data: {
        contacts: serializedContacts,
        total,
        page,
        totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return {
      success: false,
      message: 'Failed to fetch contacts',
    };
  }
}

/**
 * Get single contact by ID
 */
export async function getContactById(id: string): Promise<ServerActionResponse<SerializedContact>> {
  try {
    await connectDB();

    const contact = await Contactus.findById(id).lean<ContactRecord>();

    if (!contact) {
      return {
        success: false,
        message: 'Contact not found',
      };
    }

    // Serialize contact
    const serializedContact = serializeContact(contact);

    return {
      success: true,
      message: 'Contact fetched successfully',
      data: serializedContact,
    };
  } catch (error) {
    console.error('Error fetching contact:', error);
    return {
      success: false,
      message: 'Failed to fetch contact',
    };
  }
}

/**
 * Update contact (status and/or admin notes)
 */
export async function updateContact(
  id: string,
  data: { status?: string; adminNotes?: string }
): Promise<ServerActionResponse> {
  try {
    await connectDB();

    const contact = await Contactus.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!contact) {
      return {
        success: false,
        message: 'Contact not found',
      };
    }

    return {
      success: true,
      message: 'Contact updated successfully',
    };
  } catch (error) {
    console.error('Error updating contact:', error);
    return {
      success: false,
      message: 'Failed to update contact',
    };
  }
}

/**
 * Delete single contact
 */
export async function deleteContact(id: string): Promise<ServerActionResponse> {
  try {
    await connectDB();

    const contact = await Contactus.findByIdAndDelete(id);

    if (!contact) {
      return {
        success: false,
        message: 'Contact not found',
      };
    }

    return {
      success: true,
      message: 'Contact deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting contact:', error);
    return {
      success: false,
      message: 'Failed to delete contact',
    };
  }
}

/**
 * Bulk delete contacts
 */
export async function bulkDeleteContacts(ids: string[]): Promise<ServerActionResponse> {
  try {
    await connectDB();

    const result = await Contactus.deleteMany({ _id: { $in: ids } });

    return {
      success: true,
      message: `${result.deletedCount} contact(s) deleted successfully`,
    };
  } catch (error) {
    console.error('Error bulk deleting contacts:', error);
    return {
      success: false,
      message: 'Failed to delete contacts',
    };
  }
}

/**
 * Bulk update status
 */
export async function bulkUpdateStatus(
  ids: string[],
  status: string
): Promise<ServerActionResponse> {
  try {
    await connectDB();

    const result = await Contactus.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    return {
      success: true,
      message: `${result.modifiedCount} contact(s) updated successfully`,
    };
  } catch (error) {
    console.error('Error bulk updating status:', error);
    return {
      success: false,
      message: 'Failed to update contacts',
    };
  }
}
