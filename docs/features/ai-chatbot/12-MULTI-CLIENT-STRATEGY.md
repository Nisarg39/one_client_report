# AI Chatbot - Multi-Client Strategy

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-19
**Owner**: Engineering Team

---

## Table of Contents
1. [Overview](#1-overview)
2. [Use Case & User Flow](#2-use-case--user-flow)
3. [Data Architecture](#3-data-architecture)
4. [UI Components](#4-ui-components)
5. [Client Management](#5-client-management)
6. [Platform Configuration](#6-platform-configuration)
7. [Chat History Isolation](#7-chat-history-isolation)
8. [Implementation Plan](#8-implementation-plan)

---

## 1. Overview

### Problem Statement

**Original Assumption**: 1 User = 1 Set of Platforms = 1 Chat History

**Reality**: Users (agencies/freelancers) manage **multiple clients**, each with:
- Different platform connections
- Different metrics/data
- Separate conversation histories

### Solution

Implement **multi-client architecture** where:
- User creates/manages multiple clients
- Each client has independent platform configurations
- Each client has isolated chat history
- User switches between clients via dropdown
- AI context switches to selected client's data

### Example Scenario

```
User: Marketing Agency "GrowthCo"

Client A: "Acme Corp"
├── Platforms: Google Analytics, Google Ads
├── Last Chat: "How many conversions yesterday?" → "Acme had 156 conversions"
└── Data: Acme's GA/Ads metrics

Client B: "TechStart Inc"
├── Platforms: Meta Ads, LinkedIn Ads
├── Last Chat: "What's my Meta spend?" → "TechStart spent $1,234"
└── Data: TechStart's Meta/LinkedIn metrics

Client C: "Local Shop"
├── Platforms: Google Analytics only
├── Last Chat: "Show website traffic" → "Local Shop had 432 visitors"
└── Data: Local Shop's GA metrics
```

When user selects "Acme Corp" → AI sees Acme's data & history
When user selects "TechStart Inc" → AI sees TechStart's data & history

---

## 2. Use Case & User Flow

### Primary Use Cases

**1. Agency Managing Multiple Clients**
- Agency has 10-50 clients
- Each client has different platforms
- Agency asks AI questions about specific client's data
- Need to switch between clients quickly

**2. Freelancer Managing Clients**
- Freelancer has 5-10 clients
- Each client has their own marketing accounts
- Freelancer reviews each client's performance separately

**3. Consultant/Strategist**
- Works with multiple brands
- Each brand has unique platform setup
- Needs isolated conversation history per brand

### User Flow

```
1. User logs in → Sees their clients list
2. User selects "Client A" from dropdown
3. Chat loads → Shows Client A's conversation history
4. User asks: "How many visitors last week?"
5. AI responds with Client A's data: "Client A had 12,547 visitors"
6. User switches to "Client B"
7. Chat loads → Shows Client B's conversation history (different history!)
8. User asks: "How many visitors last week?"
9. AI responds with Client B's data: "Client B had 3,892 visitors"
```

**Key Point**: Same question, different answer based on selected client!

---

## 3. Data Architecture

### Database Schema

#### Client Model
```typescript
// New: Client collection
interface Client {
  _id: ObjectId;
  userId: ObjectId;           // Who owns this client (agency user)
  name: string;               // "Acme Corp"
  email?: string;             // client@acmecorp.com
  logo?: string;              // URL to client logo

  // Platform connections (per client)
  platforms: {
    googleAnalytics?: {
      connected: boolean;
      accountId: string;
      propertyId: string;
      accessToken: string;    // Encrypted
      refreshToken: string;   // Encrypted
      expiresAt: Date;
      lastSync: Date;
      metrics: {
        sessions: number;
        users: number;
        bounceRate: number;
        // ... cached GA data
      };
    };

    googleAds?: {
      connected: boolean;
      customerId: string;
      accessToken: string;
      refreshToken: string;
      expiresAt: Date;
      lastSync: Date;
      metrics: {
        clicks: number;
        impressions: number;
        spend: number;
        // ... cached Ads data
      };
    };

    metaAds?: { /* ... */ };
    linkedInAds?: { /* ... */ };
  };

  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Updated Conversation Model
```typescript
// Updated: Add clientId to conversations
interface Conversation {
  _id: ObjectId;
  conversationId: string;     // UUID
  userId: ObjectId;           // Agency owner
  clientId: ObjectId;         // NEW! Which client this is about
  messages: Message[];
  status: 'active' | 'archived' | 'deleted';
  messageCount: number;
  createdAt: Date;
  lastMessageAt: Date;
}

// Indexes
conversationSchema.index({ userId: 1, clientId: 1, status: 1 });
conversationSchema.index({ clientId: 1, lastMessageAt: -1 });
```

#### User Model (Unchanged)
```typescript
// User remains the same (agency owner)
interface User {
  _id: ObjectId;
  email: string;
  name: string;
  // ... auth fields
}
```

### Data Relationships

```
User (1) → Clients (Many)
  └─ Each client has platforms

User (1) + Client (1) → Conversations (Many)
  └─ Conversations filtered by userId + clientId

Client (1) → Platform Data (Embedded)
  └─ Each client has their own platform connections
```

---

## 4. UI Components

### Client Selector Component

**Location**: Chat header (top of chat interface)

**Design**:
```tsx
<div className="chat-header">
  <ClientSelector
    currentClient={{
      id: "client-123",
      name: "Acme Corp",
      logo: "/logos/acme.png"
    }}
    clients={[
      { id: "client-123", name: "Acme Corp", logo: "/logos/acme.png" },
      { id: "client-456", name: "TechStart Inc", logo: "/logos/techstart.png" },
      { id: "client-789", name: "Local Shop", logo: null }
    ]}
    onClientChange={(clientId) => switchClient(clientId)}
  />
</div>
```

**Features**:
- Dropdown with search
- Shows client logo + name
- Keyboard navigation (⌘K to open)
- Shows "No platforms connected" badge if client has no platforms
- Shows unread message count badge

### Create Client Modal

**Trigger**: "+ New Client" button in client selector

**Fields**:
```tsx
<CreateClientModal>
  <input name="clientName" placeholder="Client Name" required />
  <input name="clientEmail" placeholder="Email (optional)" />
  <input name="clientLogo" type="file" accept="image/*" />
  <button>Create Client</button>
</CreateClientModal>
```

### Client Management Page

**Route**: `/dashboard/clients`

**Features**:
- List all clients
- Edit client details
- Archive/delete clients
- View client's platform connections
- Quick link to chat with client

---

## 5. Client Management

### Creating a Client

**User Flow**:
1. User clicks "+ New Client" in chat
2. Modal opens with form
3. User enters: "Acme Corp"
4. Client created with empty platforms
5. User redirected to client's settings to connect platforms

**API**:
```typescript
// Server Action
async function createClient(data: {
  name: string;
  email?: string;
  logo?: string;
}): Promise<Client> {
  const user = await getCurrentUser();

  const client = await Client.create({
    userId: user.id,
    name: data.name,
    email: data.email,
    logo: data.logo,
    platforms: {},
    status: 'active'
  });

  return client;
}
```

### Switching Clients

**User Flow**:
1. User clicks client dropdown
2. Selects different client
3. Chat clears and loads new client's history
4. AI context switches to new client's data

**State Management**:
```typescript
// Zustand store
interface ChatStore {
  currentClientId: string | null;
  clients: Client[];

  setCurrentClient: (clientId: string) => void;
  loadClientConversations: (clientId: string) => Promise<void>;
}
```

### Deleting/Archiving Clients

**Rules**:
- Can't delete client with conversations (must archive)
- Archive = status: 'archived' (hides from selector, preserves data)
- Delete = hard delete (admin only, requires confirmation)

---

## 6. Platform Configuration

### Per-Client Platform Setup

**Important**: Platforms are configured **per client**, not per user!

**Flow**:
1. User selects "Acme Corp"
2. Goes to Settings → Integrations
3. Connects Google Analytics for Acme Corp
4. OAuth tokens stored under Acme's Client record
5. Background job syncs Acme's data
6. User switches to "TechStart Inc"
7. TechStart has NO platforms connected yet
8. User connects Meta Ads for TechStart
9. Now Acme has GA, TechStart has Meta

**Data Structure**:
```typescript
// Client A
{
  name: "Acme Corp",
  platforms: {
    googleAnalytics: { connected: true, metrics: {...} },
    googleAds: { connected: true, metrics: {...} }
  }
}

// Client B
{
  name: "TechStart Inc",
  platforms: {
    metaAds: { connected: true, metrics: {...} }
  }
}
```

### Settings UI Changes

**Before** (single user):
```
Settings → Integrations
├── Connect Google Analytics
├── Connect Google Ads
└── Connect Meta Ads
```

**After** (multi-client):
```
Settings → Integrations (for Acme Corp)
├── Connect Google Analytics for Acme
├── Connect Google Ads for Acme
└── Connect Meta Ads for Acme

[Client Selector: Change to TechStart Inc]

Settings → Integrations (for TechStart Inc)
├── Connect Google Analytics for TechStart
├── Connect Google Ads for TechStart
└── Connect Meta Ads for TechStart
```

---

## 7. Chat History Isolation

### Conversation Filtering

**Query**:
```typescript
// Get conversations for specific client
const conversations = await Conversation.find({
  userId: currentUser.id,
  clientId: selectedClientId,
  status: 'active'
}).sort({ lastMessageAt: -1 });
```

**NOT**:
```typescript
// ❌ Wrong - shows all conversations across all clients
const conversations = await Conversation.find({
  userId: currentUser.id
});
```

### AI Context Switching

**System Prompt**:
```typescript
function buildSystemPrompt(client: Client): string {
  const clientPlatforms = Object.keys(client.platforms)
    .filter(p => client.platforms[p].connected)
    .map(p => formatPlatformName(p));

  return `
    You are OneAssist, AI assistant for ${client.name}.

    ${client.name}'s Connected Platforms:
    ${clientPlatforms.map(p => `- ${p}`).join('\n')}

    ${client.name}'s Current Metrics:
    ${formatMetrics(client.platforms)}

    When user asks about data, ONLY reference ${client.name}'s metrics.
    Do NOT mix data from other clients.
  `;
}
```

**Key Point**: AI prompt includes client name and client's data only!

---

## 8. Implementation Plan

### Phase 1: Database & Models (Week 2)

**Tasks**:
- [x] Create Client Mongoose model
- [x] Update Conversation model with clientId field
- [x] Add indexes for multi-client queries
- [x] Create migration script (add clientId to existing conversations)

**Deliverables**:
- `/src/models/Client.ts`
- Updated `/src/models/Conversation.ts`
- Migration script

### Phase 2: Client Management UI (Week 2-3)

**Tasks**:
- [ ] Create ClientSelector component
- [ ] Create CreateClient modal
- [ ] Add client dropdown to chat header
- [ ] Update chat store for multi-client
- [ ] Implement client switching logic

**Deliverables**:
- `/src/components/chat/ClientSelector.tsx`
- `/src/components/chat/CreateClient.tsx`
- Updated Zustand store

### Phase 3: Chat Integration (Week 3)

**Tasks**:
- [ ] Filter conversations by clientId
- [ ] Update AI prompts with client context
- [ ] Test client switching
- [ ] Add "No client selected" state

**Deliverables**:
- Client-aware chat loading
- Client-aware AI responses

### Phase 4: Platform Configuration (Week 4)

**Tasks**:
- [ ] Update Settings UI to show current client
- [ ] Store platform tokens per client
- [ ] Update background sync jobs per client
- [ ] Test multi-client platform data

**Deliverables**:
- Per-client platform setup
- Per-client data syncing

---

## Summary

### Key Changes from Original Plan

| Aspect | Original (Single User) | New (Multi-Client) |
|--------|----------------------|-------------------|
| **User Model** | User has platforms | User has clients → Clients have platforms |
| **Conversations** | userId only | userId + clientId |
| **Platform Data** | User.platforms | Client.platforms |
| **Chat History** | All user's conversations | Filtered by clientId |
| **AI Context** | User's platform data | Selected client's platform data |
| **Settings** | Connect platforms | Connect platforms per client |

### Benefits

✅ **Agency-Ready**: Perfect for agencies managing 10-50 clients
✅ **Isolated Data**: Each client's data is separate and secure
✅ **Scalable**: Can handle hundreds of clients per user
✅ **Clean UX**: Simple client selector, no confusion
✅ **Flexible**: Each client can have different platform mix

### Implementation Status

- [x] Planning complete
- [x] Database schema designed
- [ ] Models created
- [ ] UI components built
- [ ] Client management working
- [ ] Chat filtering by client
- [ ] Platform configuration per client
- [ ] Testing complete

---

**Next Steps**: Implement Client model and update Conversation model with clientId field.

See updated implementation in [08-IMPLEMENTATION-ROADMAP-COMPLETE.md](./08-IMPLEMENTATION-ROADMAP-COMPLETE.md)
