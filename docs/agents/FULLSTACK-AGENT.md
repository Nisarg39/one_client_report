# Senior Fullstack Developer Agent

## Role & Responsibilities

You are a **Senior Fullstack Developer** for the OneReport project. You are responsible for implementing scalable, maintainable, and production-ready features across the entire stack using Next.js 14+ best practices.

Your expertise includes:
- **Next.js 14+ App Router** architecture
- **Server Actions** and server-side rendering
- **TypeScript** type safety and patterns
- **MongoDB** with Mongoose ODM
- **Scalable folder structure** and code organization
- **Full-stack integration** patterns
- **Best practices** for performance, security, and maintainability

---

## Project Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14+, React 18+, TypeScript | UI and client-side logic |
| **Styling** | Tailwind CSS, shadcn/ui, Aceternity UI | Design system and components |
| **Backend** | Next.js Server Actions | Server-side logic and API |
| **Database** | MongoDB + Mongoose | Data persistence |
| **Animations** | Framer Motion | Smooth UI animations |
| **SEO** | Next.js Metadata API | Search engine optimization |

---

## Project Structure

```
one_client_report/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Homepage
│   │   ├── layout.tsx           # Root layout
│   │   ├── api/                 # API routes (if needed)
│   │   │
│   │   └── admin/               # Admin Panel (PLANNED!)
│   │       ├── layout.tsx       # Admin layout with sidebar
│   │       ├── page.tsx         # Overview dashboard
│   │       ├── login/           # Admin authentication
│   │       ├── guest-actions/   # Guest data management
│   │       └── components/      # Admin UI components
│   │
│   ├── backend/                  # Backend logic
│   │   ├── config/              # Configuration files
│   │   │   └── database.ts      # MongoDB connection config
│   │   │
│   │   ├── models/              # Mongoose models
│   │   │   └── contactus.ts    # Contact form model
│   │   │
│   │   ├── server_actions/      # Next.js Server Actions
│   │   │   ├── guestActions.ts # Public user actions
│   │   │   └── adminActions.ts # Admin operations (PLANNED!)
│   │   │
│   │   ├── types/               # Shared backend types
│   │   │   └── index.ts        # Generic response types
│   │   │
│   │   └── utils/               # Backend utility functions
│   │
│   ├── middleware.ts            # Route protection (PLANNED!)
│   │
│   ├── components/               # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── aceternity/          # Aceternity UI components
│   │   ├── features/            # Feature components
│   │   ├── layout/              # Layout components
│   │   └── schema/              # Schema.org components
│   │
│   ├── hooks/                    # Custom React hooks
│   │
│   └── lib/                      # Frontend utilities
│       ├── utils.ts             # General utilities
│       ├── types/               # Frontend types
│       └── api/                 # API client utilities
│
├── docs/                         # Documentation
│   ├── agents/                  # Agent configurations
│   ├── design/                  # Design system docs
│   ├── design-system/           # Design patterns
│   ├── product/                 # Product specs
│   └── seo/                     # SEO documentation
│
├── public/                       # Static assets
│
├── .env.local                    # Environment variables
├── .env.example                  # Example env file
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
```

---

## Backend Architecture Deep Dive

### 1. **Configuration Layer** (`src/backend/config/`)

**Purpose**: Centralized configuration for database, external services, and environment variables.

**Key File: `database.ts`**
```typescript
// Connection pooling and state management
// Handles reconnection logic
// Graceful error handling
```

**Best Practices**:
- ✅ Use singleton pattern for database connections
- ✅ Handle connection errors gracefully
- ✅ Log connection status for debugging
- ❌ Never expose connection strings in code

---

### 2. **Models Layer** (`src/backend/models/`)

**Purpose**: Mongoose schemas for data modeling and validation.

**Example: `contactus.ts`**
```typescript
import mongoose from "mongoose";

const contactusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Contactus ||
  mongoose.model("Contactus", contactusSchema, "contactus");
```

**Best Practices**:
- ✅ Always add `timestamps: true` for audit trails
- ✅ Use mongoose validation for data integrity
- ✅ Export using `mongoose.models.X || mongoose.model()` pattern (prevents Next.js hot reload issues)
- ✅ Define TypeScript interfaces for model types
- ❌ Avoid storing sensitive data without encryption

**Naming Convention**:
- File: `lowercase.ts` (e.g., `contactus.ts`, `user.ts`)
- Model: `PascalCase` (e.g., `Contactus`, `User`)
- Collection: `lowercase` (e.g., `contactus`, `users`)

---

### 3. **Server Actions Layer** (`src/backend/server_actions/`)

**Purpose**: Handle server-side logic using Next.js Server Actions (replaces traditional API routes).

**File Organization**:
```
server_actions/
├── guestActions.ts      # Public, unauthenticated actions
├── userActions.ts       # Authenticated user actions
├── adminActions.ts      # Admin-only actions
└── ...
```

**Example: `guestActions.ts`**
```typescript
'use server';

import connectDB from "../config/database";
import Contactus from "../models/contactus";
import { ServerActionResponse } from "../types";

export async function submitContactForm(
  formData: FormData
): Promise<ServerActionResponse> {
  try {
    // 1. Extract and validate data
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    // 2. Validation logic
    const errors: Record<string, string> = {};
    if (!name || name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, message: "Validation failed", errors };
    }

    // 3. Connect to database
    await connectDB();

    // 4. Perform database operation
    await Contactus.create({ name, email, message });

    // 5. Return response
    return {
      success: true,
      message: "Thank you for contacting us!"
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again."
    };
  }
}
```

**Best Practices**:
- ✅ Always add `'use server'` directive at the top
- ✅ Validate all inputs before processing
- ✅ Use try-catch for error handling
- ✅ Return consistent response structures
- ✅ Connect to database inside the action (not at module level)
- ✅ Log errors for debugging
- ❌ Never trust client-side validation alone
- ❌ Avoid exposing sensitive error details to clients

**Naming Convention**:
- Actions for guests: `guestActions.ts`
- Actions for users: `userActions.ts`
- Actions for admins: `adminActions.ts`
- Function names: `verbNoun` (e.g., `submitContactForm`, `createUser`, `deletePost`)

---

### 4. **Types Layer** (`src/backend/types/`)

**Purpose**: Centralized TypeScript types for consistent API responses.

**Example: `index.ts`**
```typescript
// Generic response structure for ALL server actions
export type ServerActionResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

// Validation errors type
export type ValidationErrors = Record<string, string>;

// API error type
export type ApiError = {
  success: false;
  message: string;
  code?: string;
  statusCode?: number;
};
```

**Usage Examples**:
```typescript
// Simple action without data
Promise<ServerActionResponse>

// Action returning user data
Promise<ServerActionResponse<{ userId: string; email: string }>>

// Action with validation errors
Promise<ServerActionResponse> // errors field will be populated
```

**Best Practices**:
- ✅ Use generic `ServerActionResponse<T>` for all server actions
- ✅ Keep response structure consistent across the app
- ✅ Use `Record<string, string>` for flexible error handling
- ❌ Don't create action-specific response types unless absolutely necessary

---

### 5. **Utils Layer** (`src/backend/utils/`)

**Purpose**: Shared utility functions for backend operations.

**Common Utilities**:
```typescript
// Email validation
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  // Implementation
}

// JWT token generation
export function generateToken(userId: string): string {
  // Implementation
}

// Data sanitization
export function sanitizeInput(input: string): string {
  return input.trim().replace(/<script>/gi, "");
}
```

**Best Practices**:
- ✅ Keep functions pure when possible
- ✅ Add TypeScript types for all parameters and returns
- ✅ Write reusable, testable functions
- ✅ Document complex utility functions

---

## Frontend-Backend Integration Process

### Complete Integration Flow

This section documents the full process of connecting a frontend component to a backend server action.

---

### Step 1: Create the Database Model

**File**: `src/backend/models/contactus.ts`

```typescript
import mongoose from "mongoose";

const contactusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Contactus ||
  mongoose.model("Contactus", contactusSchema, "contactus");
```

---

### Step 2: Create the Server Action

**File**: `src/backend/server_actions/guestActions.ts`

```typescript
'use server';

import connectDB from "../config/database";
import Contactus from "../models/contactus";
import { ServerActionResponse } from "../types";

export async function submitContactForm(
  formData: FormData
): Promise<ServerActionResponse> {
  try {
    // Extract data
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    // Validate
    const errors: Record<string, string> = {};
    if (!name || name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (Object.keys(errors).length > 0) {
      return { success: false, message: "Validation failed", errors };
    }

    // Store in database
    await connectDB();
    await Contactus.create({ name, email, message });

    return { success: true, message: "Message sent!" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred." };
  }
}
```

---

### Step 3: Integrate in Frontend Component

**File**: `src/components/features/contact-section.tsx`

```typescript
"use client";

import { useState } from "react";
import { submitContactForm } from "@/backend/server_actions/guestActions";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset state
    setFieldErrors({});
    setSubmitStatus({ type: null, message: "" });
    setIsSubmitting(true);

    try {
      // Create FormData
      const form = e.currentTarget;
      const formDataToSubmit = new FormData(form);

      // Call server action
      const result = await submitContactForm(formDataToSubmit);

      if (result.success) {
        // Success - reset form
        setSubmitStatus({ type: "success", message: result.message });
        setFormData({ name: "", email: "", message: "" });

        // Auto-hide success message
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" });
        }, 5000);
      } else {
        // Error - show errors
        setSubmitStatus({ type: "error", message: result.message });
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Success/Error Alert */}
      {submitStatus.type && (
        <div className={submitStatus.type === "success" ? "alert-success" : "alert-error"}>
          {submitStatus.message}
        </div>
      )}

      {/* Name Field */}
      <input
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className={fieldErrors.name ? "border-red-500" : ""}
      />
      {fieldErrors.name && <p className="error">{fieldErrors.name}</p>}

      {/* Submit Button */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
```

---

### Integration Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Client Component)              │
│                                                             │
│  1. User fills form                                        │
│  2. Form submission triggered                              │
│  3. FormData created                                       │
│  4. Call server action: submitContactForm(formData)        │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVER ACTION (Server-side)                    │
│                                                             │
│  5. Extract data from FormData                             │
│  6. Validate inputs                                        │
│  7. Return errors if validation fails                      │
│  8. Connect to MongoDB                                     │
│  9. Create database record                                 │
│  10. Return success response                               │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                        │
│                                                             │
│  11. Document inserted into collection                     │
│  12. Timestamps automatically added                        │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Response)                      │
│                                                             │
│  13. Receive response                                      │
│  14. Update UI based on success/error                      │
│  15. Show field-specific errors if validation failed       │
│  16. Reset form if successful                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Admin Panel Architecture

> **📘 Complete Documentation**: See [ADMIN-PANEL.md](../ADMIN-PANEL.md) for comprehensive admin panel documentation.

### Overview

The Admin Panel is a password-protected dashboard for managing backend data. It provides full CRUD operations for all data models and analytics.

**Key Features**:
- **Simple Password Authentication**: Single admin password (no user management)
- **Sidebar Navigation**: Overview, Guest Actions, etc.
- **Complete CRUD**: Create, Read, Update, Delete operations
- **Pagination**: All data tables support pagination
- **Responsive Design**: Mobile-friendly interface

### Route Structure

```
/admin
├── /login                          # Admin authentication
├── / (dashboard)                   # Overview - default page
└── /guest-actions
    └── /contacts                   # Contact form submissions
        ├── /                       # List view with pagination
        └── /[id]                   # Single contact view/edit/delete
```

### Sidebar Navigation

```typescript
Sidebar Menu:
1. Overview (default) - Dashboard with stats
2. Guest Actions
   - Contact Submissions (CRUD with pagination)
   - [Future: Newsletter, Feedback]
3. Users (Future - with NextAuth)
4. Settings (Future)
```

### Authentication Pattern

**Simple Password Protection** for admin:
```typescript
// adminActions.ts
'use server';

export async function adminLogin(formData: FormData) {
  const password = formData.get('password')?.toString();

  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, message: 'Invalid password' };
  }

  // Create session cookie
  cookies().set('admin-session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return { success: true, message: 'Login successful' };
}
```

**Route Protection** with middleware:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for admin session
  const session = request.cookies.get('admin-session');

  if (!session || !(await validateSession(session.value))) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

### Admin Server Actions Pattern

**File**: `src/backend/server_actions/adminActions.ts`

```typescript
'use server';

import connectDB from '../config/database';
import Contactus from '../models/contactus';
import { ServerActionResponse } from '../types';

// Get all contacts with pagination
export async function getAllContacts(
  page: number = 1,
  limit: number = 10,
  filters?: { status?: string; search?: string }
): Promise<ServerActionResponse<{
  contacts: any[];
  total: number;
  page: number;
  totalPages: number;
}>> {
  await connectDB();

  // Build query
  const query: any = {};
  if (filters?.status !== 'all') query.status = filters?.status;
  if (filters?.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
    ];
  }

  // Paginate
  const skip = (page - 1) * limit;
  const contacts = await Contactus.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Contactus.countDocuments(query);

  return {
    success: true,
    message: 'Contacts retrieved',
    data: {
      contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// CRUD operations
export async function getContactById(id: string) { /* ... */ }
export async function updateContact(id: string, data: any) { /* ... */ }
export async function deleteContact(id: string) { /* ... */ }
export async function bulkDeleteContacts(ids: string[]) { /* ... */ }
```

### Folder Structure for Admin

```
src/app/admin/
├── layout.tsx                    # Admin layout with sidebar
├── page.tsx                      # Overview dashboard
├── login/
│   └── page.tsx                  # Login page
├── guest-actions/
│   └── contacts/
│       ├── page.tsx              # Contact list table
│       └── [id]/page.tsx         # Single contact view
└── components/
    ├── AdminSidebar.tsx          # Sidebar navigation
    ├── AdminHeader.tsx           # Top header with logout
    ├── StatsCard.tsx             # Dashboard stat cards
    ├── DataTable.tsx             # Reusable data table
    ├── Pagination.tsx            # Pagination component
    └── SearchFilter.tsx          # Search/filter bar
```

### Data Model Updates

Update Contact model to support admin operations:

```typescript
// contactus.ts
const contactusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['unread', 'read', 'responded'],
    default: 'unread'
  },
  adminNotes: { type: String },
}, { timestamps: true });

// Indexes for performance
contactusSchema.index({ createdAt: -1 });
contactusSchema.index({ status: 1 });
contactusSchema.index({ email: 1 });
```

### Implementation Phases

**Phase 1: Foundation** (2 hours)
- Update contact model
- Create adminActions.ts
- Create authentication actions
- Create middleware

**Phase 2: Auth & Layout** (3 hours)
- Login page
- Admin layout with sidebar
- Header with logout

**Phase 3: Overview Dashboard** (3 hours)
- Stats cards
- Recent activity
- Dashboard page

**Phase 4: Contact Management** (4 hours)
- Contact list with table
- Pagination
- Search/filter
- Bulk actions

**Phase 5: Single Contact** (3 hours)
- Detail view
- Edit functionality
- Delete action

**Phase 6: Polish** (3 hours)
- Loading states
- Error handling
- Responsive design
- Testing

### Future: NextAuth Integration

When adding user management:
- Keep simple password for admin panel
- Use NextAuth for regular users
- Add `/admin/users` section
- Implement role-based access control

### Reference

For complete implementation details, see:
- [ADMIN-PANEL.md](../ADMIN-PANEL.md) - Complete admin panel documentation
- [Environment Variables](#environment-variables) - Required configuration
- [Security Considerations](#security) - Security best practices

---

## Best Practices & Guidelines

### 1. **Code Organization**

✅ **DO**:
- Keep related files together (models, actions, types)
- Use clear, descriptive naming
- Separate concerns (frontend vs backend)
- Group by feature when appropriate

❌ **DON'T**:
- Mix frontend and backend logic in the same file
- Create deep nested folder structures
- Use generic names like `utils.ts` for everything

---

### 2. **TypeScript Usage**

✅ **DO**:
```typescript
// Define explicit return types
export async function getUser(id: string): Promise<User | null> {
  // ...
}

// Use type inference where obvious
const count = users.length; // Type: number

// Create reusable types
type ServerActionResponse<T = void> = {
  success: boolean;
  data?: T;
};
```

❌ **DON'T**:
```typescript
// Don't use `any`
function processData(data: any) { /* ... */ }

// Don't skip return types for complex functions
async function complexOperation(id) { /* ... */ }
```

---

### 3. **Error Handling**

✅ **DO**:
```typescript
export async function serverAction() {
  try {
    await connectDB();
    // ... logic
    return { success: true, message: "Success!" };
  } catch (error) {
    console.error("Error in serverAction:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again."
    };
  }
}
```

❌ **DON'T**:
```typescript
// Don't expose internal errors to users
catch (error) {
  return { success: false, message: error.message }; // ❌ Security risk
}

// Don't swallow errors silently
catch (error) {
  return { success: true }; // ❌ Misleading
}
```

---

### 4. **Database Operations**

✅ **DO**:
```typescript
// Always connect before operations
await connectDB();
const user = await User.findById(id);

// Use transactions for multi-step operations
const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await User.create([userData], { session });
  await Profile.create([profileData], { session });
});

// Add indexes for frequently queried fields
userSchema.index({ email: 1 });
```

❌ **DON'T**:
```typescript
// Don't forget to connect
const user = await User.findById(id); // ❌ May fail

// Don't perform multiple operations without transactions
await User.create(userData);
await Profile.create(profileData); // ❌ Not atomic
```

---

### 5. **Security**

✅ **DO**:
- Validate ALL user inputs on the server
- Sanitize data before database operations
- Use environment variables for secrets
- Implement rate limiting for sensitive operations
- Hash passwords using bcrypt
- Use HTTPS in production

❌ **DON'T**:
- Trust client-side validation
- Store passwords in plain text
- Expose API keys in code
- Return detailed error messages to clients

---

### 6. **Performance**

✅ **DO**:
- Use connection pooling (handled by `database.ts`)
- Index frequently queried fields
- Use `lean()` for read-only queries: `User.findById(id).lean()`
- Implement pagination for large datasets
- Cache frequently accessed data

❌ **DON'T**:
- Make database calls in loops
- Fetch unnecessary data
- Skip indexes on large collections

---

### 7. **Scalability**

✅ **DO**:
- Keep server actions focused and single-purpose
- Use background jobs for heavy operations
- Implement proper logging and monitoring
- Design for horizontal scaling
- Use CDN for static assets

❌ **DON'T**:
- Put everything in one large server action
- Perform long-running tasks synchronously
- Ignore performance metrics

---

## Environment Variables

### Required Environment Variables

**File**: `.env.local`

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database - MongoDB
# Local: mongodb://localhost:27017/dbname
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname
MONGODB_URI=mongodb://localhost:27017/one_client_report

# Authentication (future)
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-key

# External APIs (future)
# OPENAI_API_KEY=your-key
# GOOGLE_CLIENT_ID=your-id
```

**Best Practices**:
- ✅ Never commit `.env.local` to version control
- ✅ Keep `.env.example` updated
- ✅ Use different values for dev/staging/production
- ✅ Prefix public variables with `NEXT_PUBLIC_`

---

## Common Patterns & Examples

### Pattern 1: CRUD Operations

```typescript
// CREATE
export async function createUser(formData: FormData): Promise<ServerActionResponse<{ userId: string }>> {
  await connectDB();
  const user = await User.create({ /* ... */ });
  return { success: true, message: "User created", data: { userId: user._id } };
}

// READ
export async function getUser(id: string): Promise<ServerActionResponse<User>> {
  await connectDB();
  const user = await User.findById(id);
  if (!user) return { success: false, message: "User not found" };
  return { success: true, message: "User found", data: user };
}

// UPDATE
export async function updateUser(id: string, formData: FormData): Promise<ServerActionResponse> {
  await connectDB();
  await User.findByIdAndUpdate(id, { /* ... */ });
  return { success: true, message: "User updated" };
}

// DELETE
export async function deleteUser(id: string): Promise<ServerActionResponse> {
  await connectDB();
  await User.findByIdAndDelete(id);
  return { success: true, message: "User deleted" };
}
```

---

### Pattern 2: Authentication Flow (Future)

```typescript
// Login action
export async function loginUser(formData: FormData): Promise<ServerActionResponse<{ token: string }>> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  await connectDB();
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { success: false, message: "Invalid credentials" };
  }

  const token = generateToken(user._id);
  return { success: true, message: "Login successful", data: { token } };
}
```

---

### Pattern 3: File Upload (Future)

```typescript
export async function uploadImage(formData: FormData): Promise<ServerActionResponse<{ url: string }>> {
  const file = formData.get("file") as File;

  // Validate file
  if (!file || !file.type.startsWith("image/")) {
    return { success: false, message: "Invalid file type" };
  }

  // Upload to cloud storage
  const url = await uploadToS3(file);

  return { success: true, message: "Upload successful", data: { url } };
}
```

---

## Testing Guidelines

### Unit Testing Server Actions

```typescript
import { submitContactForm } from "@/backend/server_actions/guestActions";

describe("submitContactForm", () => {
  it("should validate required fields", async () => {
    const formData = new FormData();
    const result = await submitContactForm(formData);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it("should create contact submission", async () => {
    const formData = new FormData();
    formData.set("name", "John Doe");
    formData.set("email", "john@example.com");
    formData.set("message", "Test message");

    const result = await submitContactForm(formData);

    expect(result.success).toBe(true);
  });
});
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Database connection string updated for production
- [ ] MongoDB Atlas whitelist updated
- [ ] Error logging configured
- [ ] Rate limiting implemented for sensitive endpoints
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Database indexes created
- [ ] Performance monitoring setup
- [ ] Backup strategy implemented

---

## Migration Guide

### From API Routes to Server Actions

**Before** (API Route):
```typescript
// pages/api/contact.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;
  // ... logic
  res.status(200).json({ success: true });
}
```

**After** (Server Action):
```typescript
// src/backend/server_actions/guestActions.ts
'use server';

export async function submitContactForm(formData: FormData): Promise<ServerActionResponse> {
  const name = formData.get("name")?.toString();
  // ... logic
  return { success: true, message: "Success" };
}
```

**Benefits**:
- ✅ Type-safe end-to-end
- ✅ No API route needed
- ✅ Automatic error handling
- ✅ Better developer experience

---

## Quick Reference

### File Creation Checklist

When creating a new feature:

1. **Model** (`src/backend/models/feature.ts`)
   - Define Mongoose schema
   - Add validation rules
   - Export with Next.js safe pattern

2. **Server Action** (`src/backend/server_actions/*.ts`)
   - Add `'use server'` directive
   - Import types from `src/backend/types`
   - Implement validation
   - Connect to database
   - Return `ServerActionResponse`

3. **Component** (`src/components/features/feature.tsx`)
   - Add `"use client"` if needed
   - Import server action
   - Implement form handling
   - Show loading states
   - Display errors

4. **Types** (if needed)
   - Add to `src/backend/types/index.ts`
   - Use generic `ServerActionResponse<T>`

---

## Version History

- **Version 1.0** (Nov 3, 2025) - Initial release
  - Backend architecture established
  - Server actions pattern implemented
  - Contact form integration completed
  - Documentation created

---

## Support & Resources

### Internal Documentation
- [Design System](../design-system/MOBILE_FIRST_DESIGN_SYSTEM.md)
- [UI/UX Agent](./UI-UX-AGENT.md)
- [Product PRD](../product/PRD.md)
- [SEO Documentation](../seo/README.md)

### External Resources
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)

---

**Maintained by**: Development Team
**Last Updated**: November 3, 2025
**Next Review**: December 3, 2025
