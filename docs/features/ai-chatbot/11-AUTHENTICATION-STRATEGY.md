# AI Chatbot - Authentication Strategy

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-19
**Owner**: Engineering Team

---

## Table of Contents
1. [Overview](#1-overview)
2. [Authentication Timeline](#2-authentication-timeline)
3. [Architecture: Auth Abstraction Layer](#3-architecture-auth-abstraction-layer)
4. [Phase-by-Phase Implementation](#4-phase-by-phase-implementation)
5. [NextAuth.js Integration Plan](#5-nextauthjs-integration-plan)
6. [Migration Strategy](#6-migration-strategy)
7. [Security Considerations](#7-security-considerations)

---

## 1. Overview

### Strategy Summary

**Goal**: Build fully functional chatbot with mock authentication first, then seamlessly transition to NextAuth.js for production.

**Why This Approach?**
- ✅ **Faster Development**: Focus on chatbot features without auth complexity
- ✅ **Easier Debugging**: Separate concerns (chatbot vs auth issues)
- ✅ **Demo-Ready Earlier**: Show working chatbot in Week 3 (before auth is ready)
- ✅ **No Wasted Work**: Auth abstraction layer works with both mock and NextAuth.js
- ✅ **Flexible**: Easy to switch auth providers later if needed

**Timeline:**
- **Weeks 1-4**: Use mock authentication (development)
- **Week 5**: Add NextAuth.js (production)
- **Total Auth Setup Time**: ~2-3 hours (not 1-2 weeks!)

---

## 2. Authentication Timeline

### Current State (Week 1)
```
✅ Login/Signup UI exists (but uses mock validation)
✅ Admin auth working (JWT-based)
❌ User authentication not implemented
❌ User model doesn't exist
❌ NextAuth.js not installed
```

### Phase 1-4: Mock Authentication (Weeks 2-4)
```typescript
// Mock user for development
{
  id: "demo-user-123",
  email: "demo@example.com",
  name: "Demo User"
}
```

**What Works:**
- ✅ Chatbot fully functional
- ✅ Conversations saved to MongoDB
- ✅ AI responses working
- ✅ Platform data integration
- ✅ All features testable

**What Doesn't Work:**
- ❌ Multiple real users
- ❌ OAuth (Google, GitHub)
- ❌ User signup/login
- ❌ Session management

### Phase 5: NextAuth.js Integration (Week 5)
```typescript
// Real authentication
{
  id: session.user.id,       // Real user ID from NextAuth
  email: session.user.email, // Real email from OAuth/credentials
  name: session.user.name    // Real name from provider
}
```

**What Gets Added:**
- ✅ Multiple real users
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Session management
- ✅ User model in MongoDB

---

## 3. Architecture: Auth Abstraction Layer

### File Structure
```
src/lib/auth/
├── adapter.ts          ← Main auth interface (used by chatbot)
├── mockAuth.ts         ← Mock implementation (Weeks 2-4)
└── nextAuth.ts         ← NextAuth.js implementation (Week 5+)
```

### Auth Adapter Interface
```typescript
// src/lib/auth/adapter.ts

/**
 * Auth user returned by getCurrentUser()
 * Same interface for both mock and real auth
 */
export interface AuthUser {
  id: string;         // User ID (MongoDB ObjectId as string)
  email: string;      // User email
  name?: string;      // User display name (optional)
}

/**
 * Get the currently authenticated user
 *
 * Implementation switches based on phase:
 * - Weeks 2-4: Returns mock user
 * - Week 5+: Returns NextAuth session user
 *
 * @returns AuthUser if authenticated, null if not
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // PHASE 1-4: Use mock
  return await getMockUser();

  // PHASE 5: Switch to NextAuth (ONE LINE CHANGE!)
  // return await getNextAuthUser();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
```

### Mock Implementation (Weeks 2-4)
```typescript
// src/lib/auth/mockAuth.ts

import type { AuthUser } from './adapter';

/**
 * Mock user for development
 * Simulates an authenticated user without real auth
 */
export async function getMockUser(): Promise<AuthUser> {
  return {
    id: "demo-user-123",
    email: "demo@example.com",
    name: "Demo User"
  };
}
```

### NextAuth.js Implementation (Week 5)
```typescript
// src/lib/auth/nextAuth.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { AuthUser } from './adapter';

/**
 * Get user from NextAuth session
 */
export async function getNextAuthUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name || undefined
  };
}
```

---

## 4. Phase-by-Phase Implementation

### Phase 0: Setup (Week 1) ✅ COMPLETE
- [x] Dependencies installed
- [x] Folder structure created
- [x] Types defined
- [x] MongoDB schemas created

### Phase 1: UI with Mock Auth (Week 2)
```typescript
// All chatbot components use the auth adapter
import { getCurrentUser } from '@/lib/auth/adapter';

// ChatWidget.tsx
export function ChatWidget() {
  const user = await getCurrentUser(); // Returns mock user

  if (!user) {
    return <LoginPrompt />;
  }

  return <ChatModal userId={user.id} />;
}
```

**Deliverable:** Working chat UI with mock user

### Phase 2: AI Integration with Mock Auth (Week 3)
```typescript
// Server Actions use the same adapter
import { getCurrentUser } from '@/lib/auth/adapter';

export async function sendMessage(message: string) {
  'use server';

  const user = await getCurrentUser(); // Still returns mock user

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Save conversation with demo-user-123
  const conversation = await Conversation.create({
    conversationId: uuidv4(),
    userId: user.id, // "demo-user-123"
    messages: [{ role: 'user', content: message }]
  });

  // Call OpenAI, stream response, etc.
}
```

**Deliverable:** Fully functional AI chatbot (single user)

### Phase 3: Platform Data (Week 4)
```typescript
// Platform data also uses mock user
const user = await getCurrentUser();

// Fetch user's platform connections
const userWithPlatforms = await User.findById(user.id);
// For mock: Create demo platform data in database
```

**Deliverable:** Chatbot that answers questions about marketing data

### Phase 4: NextAuth.js Integration (Week 5)
```typescript
// 1. Install NextAuth.js
npm install next-auth

// 2. Update auth adapter (30 seconds!)
// src/lib/auth/adapter.ts
export async function getCurrentUser(): Promise<AuthUser | null> {
  // ❌ Comment out mock
  // return await getMockUser();

  // ✅ Enable NextAuth
  return await getNextAuthUser();
}

// 3. Everything else works without changes! 🎉
```

**Deliverable:** Production-ready chatbot with real authentication

---

## 5. NextAuth.js Integration Plan

### Step 1: Install NextAuth.js (5 minutes)
```bash
npm install next-auth
```

### Step 2: Configure NextAuth.js (30 minutes)
```typescript
// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';

export const authOptions = {
  // Authentication providers (OAuth only)
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // GitHub OAuth
    GithubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],

  // Callbacks
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }

      // OAuth sign-in - Store user in database
      if (account && profile) {
        try {
          await connectDB();

          const dbUser = await UserModel.upsertFromOAuth({
            email: profile.email as string,
            name: profile.name as string,
            image: (profile as any).picture || (profile as any).avatar_url,
            provider: account.provider,
            providerId: account.providerAccountId,
          });

          token.id = dbUser._id.toString();
        } catch (error) {
          console.error('Error upserting user:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },

  // Pages
  pages: {
    signIn: "/signin",     // Custom sign-in page (OAuth only)
    error: "/signin",      // Redirect errors to sign-in
  },

  // Session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Security
  secret: process.env.NEXTAUTH_SECRET,

  // Debug (disable in production)
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Step 3: User Model (Already Created in Phase 4)
```typescript
// src/models/User.ts - OAuth-only authentication

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  provider: 'google' | 'github';  // OAuth providers only
  providerId?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  toAuthUser(): {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    enum: ['google', 'github'],  // OAuth providers only
    required: true,
  },
  providerId: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Instance method: Convert to AuthUser format
UserSchema.methods.toAuthUser = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    image: this.image,
  };
};

// Static method: Find by email
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method: Find by provider ID
UserSchema.statics.findByProviderId = function (provider: string, providerId: string) {
  return this.findOne({ provider, providerId });
};

// Static method: Create or update user from OAuth
UserSchema.statics.upsertFromOAuth = async function (profile: {
  email: string;
  name: string;
  image?: string;
  provider: string;
  providerId: string;
}) {
  const existingUser = await this.findOne({
    email: profile.email.toLowerCase(),
  });

  if (existingUser) {
    // Update existing user
    existingUser.name = profile.name;
    existingUser.image = profile.image || existingUser.image;
    existingUser.provider = profile.provider;
    existingUser.providerId = profile.providerId;
    existingUser.emailVerified = new Date();
    await existingUser.save();
    return existingUser;
  }

  // Create new user
  return await this.create({
    email: profile.email.toLowerCase(),
    name: profile.name,
    image: profile.image,
    provider: profile.provider,
    providerId: profile.providerId,
    emailVerified: new Date(),
    role: 'user',
    status: 'active',
  });
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
```

### Step 4: Create Sign-In Page (OAuth Only - 30 minutes)
```typescript
// src/app/(auth)/signin/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOAuthClick = async (provider: "google" | "github") => {
    try {
      setIsLoading(true);
      setError('');

      await signIn(provider, {
        callbackUrl: "/chat",  // NextAuth will handle new vs returning user redirect
      });
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo/Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#f5f5f5] mb-2">
          <span className="text-[#6CA3A2]">One</span>Report
        </h1>
        <p className="text-[#c0c0c0] text-sm">Sign in to continue</p>
      </div>

      {/* Sign-In Card */}
      <div className="bg-[#1a1a1a] p-8 rounded-3xl shadow-lg">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthClick("google")}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-2xl font-medium bg-[#1a1a1a] text-[#f5f5f5]
                     shadow-lg hover:shadow-xl transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <button
            type="button"
            onClick={() => handleOAuthClick("github")}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-2xl font-medium bg-[#1a1a1a] text-[#f5f5f5]
                     shadow-lg hover:shadow-xl transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Continue with GitHub"}
          </button>
        </div>

        {/* Auto-Account Creation Notice */}
        <p className="mt-6 text-xs text-[#999] text-center">
          New to OneReport? Signing in will create your account automatically.
        </p>
      </div>
    </div>
  );
}
```

**Note:** /signup route should redirect to /signin. Email/password authentication is NOT supported - OAuth only.

### Step 5: Test OAuth Flow (30 minutes)
- ✅ Visit /signin - OAuth buttons displayed
- ✅ Click "Continue with Google" - redirects to Google OAuth
- ✅ Complete Google auth - creates account automatically (if new user)
- ✅ New user redirects to /onboarding (when implemented)
- ✅ Returning user redirects to /chat
- ✅ Click "Continue with GitHub" - works after credentials added
- ✅ Sign out and sign back in - conversations persist

**Total Time: ~1-2 hours**

---

## 6. Migration Strategy

### Data Migration (If Needed)

If you have demo conversations in MongoDB with `userId: "demo-user-123"`:

```typescript
// Optional: Migrate demo conversations to real user
// Run this script once after setting up NextAuth

import { connectDB } from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

async function migrateDemoConversations() {
  await connectDB();

  // Find the real user who should own demo conversations
  const realUser = await User.findOne({ email: "your@email.com" });

  if (!realUser) {
    console.error("Real user not found");
    return;
  }

  // Update all demo conversations to belong to real user
  const result = await Conversation.updateMany(
    { userId: "demo-user-123" },
    { userId: realUser._id }
  );

  console.log(`Migrated ${result.modifiedCount} conversations`);
}

// Run once
migrateDemoConversations();
```

### Rollback Plan

If NextAuth.js causes issues, you can instantly rollback:

```typescript
// src/lib/auth/adapter.ts

export async function getCurrentUser(): Promise<AuthUser | null> {
  // ✅ Rollback to mock (instant!)
  return await getMockUser();

  // ❌ Disable NextAuth temporarily
  // return await getNextAuthUser();
}
```

Chatbot continues working with demo user while you debug NextAuth.js.

---

## 7. Security Considerations

### Mock Auth Security (Weeks 2-4)

**⚠️ IMPORTANT:** Mock auth is for **DEVELOPMENT ONLY**

**Security Limitations:**
- ❌ No real authentication
- ❌ Anyone can access chatbot
- ❌ All users share same "demo-user-123" account
- ❌ No session management

**Mitigation:**
```typescript
// Add environment check
export async function getCurrentUser(): Promise<AuthUser | null> {
  // Only allow mock in development
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Mock auth not allowed in production!');
  }

  return await getMockUser();
}
```

### NextAuth.js Security (OAuth-Only)

**Security Features:**
- ✅ JWT-based sessions
- ✅ CSRF protection (built-in)
- ✅ OAuth 2.0 (Google, GitHub)
- ✅ No password storage (OAuth providers handle authentication)
- ✅ Session expiration (30 days)
- ✅ HTTP-only cookies
- ✅ Automatic security updates from OAuth providers

**Additional Security:**
```typescript
// Rate limiting on login
import rateLimit from '@/lib/rateLimit';

export async function POST(req: Request) {
  // Limit to 5 login attempts per 15 minutes
  await rateLimit(req, { max: 5, window: 15 * 60 * 1000 });

  // ... rest of login logic
}
```

### Chatbot Security (All Phases)

**Server Action Security:**
```typescript
export async function sendMessage(message: string) {
  'use server';

  // 1. Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  // 2. Validate input
  const validated = messageSchema.parse(message);

  // 3. Check rate limits
  await checkRateLimit(user.id);

  // 4. Sanitize input (prevent injection)
  const sanitized = sanitizeMessage(validated);

  // 5. Process message
  // ...
}
```

---

## Summary

### Key Takeaways

1. ✅ **Auth abstraction layer** allows switching between mock and NextAuth.js with one line
2. ✅ **Mock auth first** enables faster chatbot development (Weeks 2-4)
3. ✅ **OAuth-only NextAuth.js** adds real authentication in ~1-2 hours (Week 5)
4. ✅ **No code changes** needed in chatbot components when switching auth
5. ✅ **Production-ready** security with OAuth (no password storage required)

### Implementation Checklist

**Phase 1-4 (Mock Auth):**
- [x] Create auth adapter interface
- [x] Implement mock auth
- [ ] Build chatbot with mock user
- [ ] Test all features with demo user

**Phase 5 (NextAuth.js - OAuth Only):**
- [x] Install next-auth
- [x] Configure OAuth providers (Google + GitHub)
- [x] Create User model (OAuth only, no password field)
- [ ] Create /signin page (OAuth buttons only)
- [ ] Remove /signup page (redirect to /signin)
- [ ] Test OAuth flows (Google + GitHub)
- [ ] Deploy to production

### Timeline

| Phase | Duration | Auth Type |
|-------|----------|-----------|
| Phase 0 | 1 hour | None |
| Phase 1 | 5-7 days | Mock |
| Phase 2 | 5-7 days | Mock |
| Phase 3 | 7-10 days | Mock |
| Phase 4 | 5-7 days | Mock |
| **Auth Setup** | **2-3 hours** | **NextAuth.js** |
| Phase 5 | 5-7 days | NextAuth.js |

**Total saved time:** ~10-12 days by deferring auth until chatbot is working!

---

**Document Complete** ✅ **Updated for OAuth-Only Authentication**

This authentication strategy ensures:
- Fast chatbot development without auth complexity
- Seamless transition to production-ready OAuth authentication (Google + GitHub)
- No password storage required (OAuth providers handle authentication)
- No wasted work or major refactoring needed
- Security best practices maintained throughout
- Simpler user experience (no signup page, auto-account creation)
