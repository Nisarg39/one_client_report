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
- ✅ GitHub OAuth (optional)
- ✅ Email/password login
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

### Step 2: Configure NextAuth.js (1 hour)
```typescript
// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  // Use MongoDB adapter for session storage
  adapter: MongoDBAdapter(clientPromise),

  // Authentication providers
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email/Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Verify credentials against User model
        const user = await verifyUserCredentials(
          credentials?.email,
          credentials?.password
        );

        return user ? {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        } : null;
      }
    })
  ],

  // Callbacks
  callbacks: {
    // Add user ID to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    }
  },

  // Pages
  pages: {
    signIn: "/login",      // Use existing login page
    signUp: "/signup",     // Use existing signup page
    error: "/login",       // Redirect errors to login
  },

  // Session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Step 3: Create User Model (30 minutes)
```typescript
// src/models/User.ts

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String, // Hashed with bcrypt
  },
  // NextAuth fields
  emailVerified: Date,
  image: String,

  // Platform connections (for chatbot)
  platforms: {
    googleAnalytics: {
      connected: Boolean,
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,
      metrics: Schema.Types.Mixed,
    },
    googleAds: { /* ... */ },
    metaAds: { /* ... */ },
    linkedInAds: { /* ... */ },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

### Step 4: Update Login/Signup Pages (1 hour)
```typescript
// src/app/(auth)/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // ❌ Remove mock alert
    // alert("Login successful (mock)");

    // ✅ Add NextAuth
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div>
      {/* Existing UI stays the same! */}
      <form onSubmit={handleSubmit}>
        {/* ... existing form fields ... */}
      </form>

      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
```

### Step 5: Update Auth Adapter (30 seconds!)
```typescript
// src/lib/auth/adapter.ts

export async function getCurrentUser(): Promise<AuthUser | null> {
  // ❌ Disable mock
  // return await getMockUser();

  // ✅ Enable NextAuth
  return await getNextAuthUser();
}
```

### Step 6: Test (30 minutes)
- ✅ Sign up new user
- ✅ Log in with email/password
- ✅ Log in with Google OAuth
- ✅ Open chatbot (should work with real user ID)
- ✅ Send messages (saved with real user ID)
- ✅ Log out and back in (conversations persist)

**Total Time: ~2-3 hours**

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

### NextAuth.js Security (Week 5+)

**Security Features:**
- ✅ JWT-based sessions
- ✅ CSRF protection (built-in)
- ✅ OAuth 2.0 (Google, GitHub)
- ✅ Password hashing (bcrypt)
- ✅ Session expiration (30 days)
- ✅ HTTP-only cookies

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
3. ✅ **NextAuth.js later** adds real authentication in ~2-3 hours (Week 5)
4. ✅ **No code changes** needed in chatbot components when switching auth
5. ✅ **Production-ready** security with NextAuth.js + proper validation

### Implementation Checklist

**Phase 1-4 (Mock Auth):**
- [x] Create auth adapter interface
- [x] Implement mock auth
- [ ] Build chatbot with mock user
- [ ] Test all features with demo user

**Phase 5 (NextAuth.js):**
- [ ] Install next-auth
- [ ] Configure auth providers
- [ ] Create User model
- [ ] Update login/signup pages
- [ ] Switch auth adapter (1 line!)
- [ ] Test with real users
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

**Document Complete** ✅

This authentication strategy ensures:
- Fast chatbot development without auth complexity
- Seamless transition to production-ready NextAuth.js
- No wasted work or major refactoring needed
- Security best practices maintained throughout
