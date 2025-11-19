# AI Chatbot - Platform Integration Specifications

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-19
**Owner**: Engineering Team

---

## Table of Contents
1. [Platform Integration Scope](#1-platform-integration-scope)
2. [Integration Flow & User Journey](#2-integration-flow--user-journey)
3. [OAuth Implementation](#3-oauth-implementation)
4. [API Key Management](#4-api-key-management)
5. [Data Fetching & Sync](#5-data-fetching--sync)
6. [Connection Status & Validation](#6-connection-status--validation)
7. [Error Handling & Retry Logic](#7-error-handling--retry-logic)
8. [Chatbot Integration Assistance](#8-chatbot-integration-assistance)
9. [Platform-Specific Requirements](#9-platform-specific-requirements)

---

## 1. Platform Integration Scope

### Question:
Which platforms should the chatbot help users connect?

**Available Platforms (from your project):**
- [ ] Google Analytics
- [ ] Google Ads
- [ ] Meta/Facebook Ads
- [ ] Instagram Ads
- [ ] LinkedIn Ads
- [ ] TikTok Ads
- [ ] Twitter/X Ads
- [ ] Other: _________________

### Your Answers:

**IMPORTANT NOTE:**
```
The chatbot does NOT handle platform connections/OAuth flows.
Platform integrations are managed separately through Settings UI.

The chatbot's role:
✅ Query data from already-connected platforms
✅ Answer questions about platform metrics
✅ Suggest connecting platforms if user asks about unconnected data
❌ Does NOT execute OAuth flows
❌ Does NOT manage API keys
❌ Does NOT handle connection setup

This document focuses on how the chatbot USES already-connected platforms.
```

**V1 Platforms (Launch):**
Priority 1: Google Analytics (most common)
Priority 2: Meta/Facebook Ads (includes Instagram)
Priority 3: Google Ads
Priority 4: LinkedIn Ads

**V2 Platforms (Future):**
1. TikTok Ads
2. Twitter/X Ads
3. Pinterest Ads

**Platform Integration Status:**
```
Platform         | Integration  | Chatbot Access | Status
-----------------+--------------+----------------+--------
Google Analytics | Settings UI  | Read cached    | V1
Google Ads       | Settings UI  | Read cached    | V1
Meta Ads         | Settings UI  | Read cached    | V1
Instagram Ads    | Via Meta     | Read cached    | V1
LinkedIn Ads     | Settings UI  | Read cached    | V1
TikTok Ads       | Future       | Future         | V2
```

---

## 2. Integration Flow & User Journey

### Question:
When a user asks to "connect Google Analytics", what should happen?

**Flow Options:**

**Option A: Chatbot-Guided Text Instructions**
```
1. User: "Connect my Google Analytics"
2. Bot: "Great! Here's how to connect Google Analytics:
   1. Go to Settings > Integrations
   2. Click 'Connect Google Analytics'
   3. Sign in with your Google account
   4. Grant permissions
   5. Come back here when done!"
3. [User leaves chat, goes to settings]
```

**Option B: In-Chat OAuth Flow**
```
1. User: "Connect my Google Analytics"
2. Bot: "I'll help you connect Google Analytics now."
   [Button: Authorize with Google]
3. [User clicks, OAuth popup opens]
4. [User grants permissions]
5. Bot: "✅ Successfully connected! I can now access your GA data."
```

**Option C: Hybrid (Instructions + Embedded UI)**
```
1. User: "Connect my Google Analytics"
2. Bot: "Let me guide you through connecting Google Analytics."
   [Card component with steps + OAuth button]
3. [User clicks OAuth button in chat]
4. [OAuth flow in popup/redirect]
5. Bot: "Connection successful! Would you like me to fetch your latest data?"
```

**Option D: Redirect to Settings Page**
```
1. User: "Connect my Google Analytics"
2. Bot: "I'll take you to the integrations page where you can connect."
   [Button: Go to Integrations]
3. [User clicks, navigates to /dashboard/settings/integrations]
4. [User completes OAuth there]
5. [Returns to chat, bot detects connection]
6. Bot: "I see you've connected Google Analytics! 🎉"
```

### Your Answer:
**Preferred Flow:** Option D - Redirect to Settings Page

```
Since the chatbot does NOT handle OAuth flows (per requirements),
the chatbot's role is to guide users to the Settings page where
they can connect platforms.

Flow:
1. User asks about platform connection in chat
2. Chatbot detects platform is not connected
3. Chatbot provides helpful explanation + link to Settings
4. User navigates to Settings > Integrations
5. User connects platform via OAuth (outside chatbot)
6. User returns to chatbot
7. Chatbot detects new connection and confirms
```

**Step-by-Step User Journey:**
```
1. User asks: "Show me my Google Analytics data"
2. Chatbot checks: Is GA connected? → No
3. Chatbot responds: "I don't see Google Analytics connected yet..."
4. User clicks: "Go to Settings" button in chat
5. User navigates: /dashboard/settings/integrations
6. User connects: OAuth flow in Settings UI
7. User returns: Back to chatbot
8. Chatbot detects: New GA connection available
9. Chatbot confirms: "Great! I see you connected Google Analytics. What would you like to know?"
```

**Chatbot Conversation Example:**
```
User: "I want to connect my Google Analytics account"

Bot: "I can't connect platforms directly, but I can guide you!

     To connect Google Analytics:
     1. Go to Settings > Integrations
     2. Click 'Connect Google Analytics'
     3. Sign in and authorize access
     4. Come back and ask me about your data!

     [Button: Go to Settings]"

User: [Clicks button, goes to settings, connects GA, returns to chat]

Bot: "🎉 I see you've connected Google Analytics! I can now answer questions
     about your traffic, users, pageviews, and more. What would you like to know?"
```

---

## 3. OAuth Implementation

### Questions:

**NOTE:** OAuth implementation is handled in Settings UI, not in the chatbot.
This section documents what the chatbot needs to know about connections.

#### 3.1 OAuth Provider Setup
Platform integrations are configured in Settings UI (separate from chatbot).

**Your Answer:**
```
OAuth credentials and setup are managed outside the chatbot scope.
The chatbot only needs to:
✅ Check if platforms are connected (read from user's profile in DB)
✅ Know which data is available per platform
✅ Guide users to Settings if platforms aren't connected

Actual OAuth implementation: Handled in /dashboard/settings/integrations
Chatbot's responsibility: Query connected platform data
```

#### 3.2 OAuth Flow Type
**N/A** - OAuth handled in Settings UI, not chatbot.

#### 3.3 OAuth Callback Handling
**N/A** - OAuth handled in Settings UI, not chatbot.

Chatbot behavior after user connects platform:
```
When user returns to chat after connecting platform:
1. Chatbot checks user.connectedPlatforms in MongoDB
2. Detects new connection
3. Shows celebration message: "🎉 Connected successfully!"
4. Offers to answer questions about new platform
```

#### 3.4 Token Storage
**N/A** - Token storage handled in Settings UI backend.

**Chatbot Data Access:**
```
Chatbot does NOT directly access OAuth tokens.

Instead, chatbot accesses:
✅ Cached platform data in MongoDB (refreshed by background jobs)
✅ User's connectedPlatforms list (to know what's available)

Data flow:
1. Background job uses tokens to fetch platform data
2. Data stored in MongoDB (encrypted, cached)
3. Chatbot queries MongoDB for data
4. No direct token access by chatbot
```

---

## 4. API Key Management

### Questions:

#### 4.1 Manual API Key Entry
**N/A** - API key entry handled in Settings UI, not chatbot.

**Your Answer:**
- [ ] Yes - For advanced users or platforms without OAuth
- [x] No - OAuth only (managed in Settings)
- [ ] Specific platforms only: _________________

```
All platform connections use OAuth (handled in Settings UI).
No manual API key entry for V1.

Chatbot role: Inform users to use Settings for all connections.
```

#### 4.2 Chatbot Assistance with API Keys
**N/A** - Not applicable (no manual API keys in V1).

**Chatbot Response if Asked:**
```
User: "I want to use my own API key for Google Analytics"

Bot: "We use OAuth for secure platform connections, which is easier and more secure than API keys.

     To connect your Google Analytics:
     1. Go to Settings > Integrations
     2. Click 'Connect Google Analytics'
     3. Authorize with your Google account

     [Button: Go to Settings]"
```

---

## 5. Data Fetching & Sync

### Questions:

#### 5.1 Initial Data Fetch
After connecting a platform, should data be fetched immediately?

**Your Answer:**
- [ ] Yes - Fetch immediately (show progress in chat)
- [x] Yes - Fetch in background (notify when complete)
- [ ] No - Fetch on-demand when user asks
- [ ] User choice

```
Platform connection happens in Settings UI.
Data fetching happens automatically via background job (not in chatbot).

Process:
1. User connects platform in Settings
2. Background job triggers immediately
3. Fetches last 30 days of data
4. Stores in MongoDB (cached)
5. User returns to chatbot
6. Chatbot can now answer questions using cached data
```

**Initial Fetch Scope:**
```
For Google Analytics:
- Date range: Last 30 days
- Metrics: Sessions, users, pageviews, bounce rate, avg session duration
- Dimensions: Device, source/medium, country, top pages
- Estimated API calls: 5-10 calls
- Time to complete: 10-30 seconds

For Google Ads:
- Date range: Last 30 days
- Metrics: Impressions, clicks, spend, CTR, conversions, CPA
- Campaigns/ad groups: All active campaigns
- Time to complete: 15-45 seconds

For Meta Ads:
- Date range: Last 30 days
- Metrics: Impressions, clicks, spend, CPM, ROAS, conversions
- Ad accounts: All accessible accounts
- Time to complete: 20-60 seconds
```

**Chatbot Behavior (Data Already Fetched):**
```
Since fetching happens in background (Settings UI), chatbot doesn't show progress.

When user asks question:
Bot: "Based on your Google Analytics data from last 30 days, you had 15,234 sessions!"
     [If data is fresh, no mention of staleness]
     [If data is old, suggest refresh - see section 5.3]
```

#### 5.2 Ongoing Data Sync
How often should data be refreshed?

**Your Answer:**
```
Sync Frequency:
- Real-time: No (too expensive, API quotas)
- Hourly: Yes (background cron job)
- Daily: Yes (full refresh at 3 AM UTC)
- On-demand: Yes (user can request via Settings or chat)

Sync Strategy:
- Hourly sync: Incremental (last 24 hours only)
- Daily sync: Full refresh (last 30 days)
- Cache duration: 1 hour (then marked as stale)
- Chatbot shows data age if > 1 hour old

Background Jobs:
- Cron job runs every hour
- Fetches latest data for all connected platforms
- Updates MongoDB cache
- Chatbot always queries cache (never live API)
```

#### 5.3 Data Availability in Chat
When a user asks about their data, should the chatbot:

**Your Answer:**
- [ ] Query live API (slower, always current)
- [x] Query cached data in MongoDB (faster, possibly stale)
- [x] Hybrid (cache with refresh option)

```
Chatbot ALWAYS queries cached MongoDB data, never live APIs.

Reasons:
✅ Fast response times (< 1 second)
✅ No API quota issues
✅ Consistent performance
✅ Simpler implementation

Freshness Handling:
- If data < 1 hour old: Show without mentioning age
- If data 1-24 hours old: Mention age, offer refresh
- If data > 24 hours old: Warn user, suggest refresh
```

**Example:**
```
User: "How many sessions did I have yesterday?"

Scenario 1 (Fresh data, < 1 hour):
Bot: "You had 1,234 sessions yesterday."

Scenario 2 (Slightly stale, 3 hours):
Bot: "Based on data from 3 hours ago, you had 1,234 sessions yesterday.
     [Button: Refresh Data]"

Scenario 3 (Very stale, 2 days):
Bot: "⚠️ Your Google Analytics data is 2 days old. For accurate results, please refresh.
     [Button: Go to Settings to Refresh]"
```

---

## 6. Connection Status & Validation

### Questions:

#### 6.1 Connection Health Checks
How should you verify platform connections are still valid?

**Your Answer:**
```
Health Check Frequency:
- On every chat message: No (too expensive)
- On user request: Yes (when user asks about platform)
- Periodic background check: Yes (hourly, during data sync)
- Before data fetch: Yes (background job checks before syncing)

Validation Method:
- Background job tests API call during hourly sync
- If API returns 401/403 (unauthorized), mark connection as invalid
- Store connection status in MongoDB user.platforms[].status
- Chatbot reads status from DB, not live check

Connection Status States:
- 'active': Working normally
- 'expired': Token expired, needs re-auth
- 'error': API error, manual fix needed
- 'disconnected': User manually disconnected
```

#### 6.2 Connection Status Display
Should the chatbot show which platforms are connected?

**Your Answer:**
- [ ] Yes - On chat open (welcome message) - Only for first-time users
- [x] Yes - When user asks ("What's connected?")
- [ ] Yes - Visual indicator in chat header - Not needed
- [x] Only mentioned when relevant (when user asks about specific platform)

**Example:**
```
Scenario 1 - User asks what's connected:
User: "What platforms are connected?"
Bot: "Here are your connected platforms:
     ✅ Google Analytics (last synced 30 min ago)
     ✅ Meta Ads (last synced 1 hour ago)
     ❌ Google Ads (not connected)
     ❌ LinkedIn Ads (not connected)

     [Button: Manage Connections]"

Scenario 2 - User asks about unconnected platform:
User: "Show me my LinkedIn Ads data"
Bot: "I don't see LinkedIn Ads connected yet. Would you like to connect it?

     [Button: Go to Settings]"
```

#### 6.3 Disconnection Detection
What happens if a connection fails (token expired, access revoked)?

**Your Answer:**
```
Detection:
- Detect on API error: Yes (background job detects during hourly sync)
- Notify user immediately: No (notify next time they use chatbot)
- Retry automatically: Yes (3 retries with exponential backoff during sync)

Notification:
- In chat: Yes (when user asks about that platform)
- Email: No (V1 - may add in V2)
- Dashboard alert: Yes (banner in Settings page)

Recovery:
- Prompt re-authorization via Settings
- Chatbot shows graceful error with reconnect link
- Demo data still available if needed
```

**Chatbot Error Message:**
```
User: "Show me my Google Analytics data"

Bot: "⚠️ I'm having trouble accessing your Google Analytics data.
     Your connection may have expired.

     Please reconnect in Settings:
     [Button: Go to Settings]

     Or try demo data:
     [Button: Show Demo Data]"
```

---

## 7. Error Handling & Retry Logic

**NOTE:** Error handling is primarily handled by background sync jobs, not the chatbot.

**Your Answer:**
```
API Rate Limits:
- Handled by background jobs (not chatbot)
- Jobs implement exponential backoff
- Chatbot uses cached data, so unaffected by rate limits

Network Errors:
- Background jobs retry 3 times with backoff (1s, 2s, 4s)
- If all retries fail, mark platform status as 'error'
- Chatbot shows cached data with warning

Data Validation Errors:
- Background jobs validate with Zod schemas
- Invalid data logged to monitoring (Sentry)
- Chatbot shows error if no valid cached data available
```

**Chatbot Error Handling:**
```
Since chatbot queries cached data (not live APIs):
✅ No rate limit issues for chatbot
✅ No network timeout issues
✅ Fast, reliable responses

If cache is empty/invalid:
Bot: "I don't have recent data for Google Analytics. This might be due to a sync issue.
     Please check Settings or try again later."
```

---

## 8. Chatbot Integration Assistance

#### 8.1 Proactive Connection Prompts
Should the chatbot proactively suggest connecting platforms?

**Your Answer:**
- [ ] Yes - On first dashboard visit - Too pushy
- [x] Yes - When user asks data questions without connections
- [ ] Yes - During onboarding - Handled in onboarding flow, not chatbot
- [ ] No - Only when user asks

**Example:**
```
User: "Show me my Google Analytics data"
[Bot detects no GA connection]

Bot: "I don't see Google Analytics connected yet. Would you like to connect it?

     [Button: Go to Settings]
     [Button: Try Demo Data]"
```

#### 8.2 Troubleshooting Assistance
**Your Answer:**
- [x] Yes - Provide basic guidance
- [x] Yes - Redirect to Settings/docs
- [ ] No

```
Chatbot provides basic troubleshooting only.
For complex issues, redirect to Settings or docs.

Example:
User: "Why can't I see my Google Analytics data?"

Bot: "Let me check... I see Google Analytics is connected but data might be syncing.

     Possible reasons:
     1. Data is still being fetched (check back in a few minutes)
     2. Connection expired (try reconnecting in Settings)
     3. No data available for selected date range

     [Button: Go to Settings]
     [Button: View Help Docs]"
```

#### 8.3 Multi-Account Handling
**Your Answer:**
```
V1: Single property per platform
- User selects one GA property, one Ad account, etc. in Settings
- Can switch in Settings later
- Chatbot queries the selected property only

V2: Multi-property support
- Connect multiple properties
- Chatbot asks which property to query:
  "Which Google Analytics property? (Main Site / Blog / Store)"

Preferred for V1: Option B (Single connection only)
Simpler implementation, covers most use cases
```

---

## 9. Platform-Specific Requirements

### Questions:

For each platform you're integrating, answer the following:

---

#### 9.1 Google Analytics

**API Version:**
- [x] Google Analytics 4 (GA4) API
- [ ] Universal Analytics (deprecated July 2023)

**Your Answer:**
```
API Version: GA4 Data API (v1)
SDK/Library: @google-analytics/data (Node.js)
Authentication: OAuth 2.0 (handled in Settings)

Data to Fetch (cached in MongoDB):
- Sessions, users, pageviews, new users
- Engagement rate, bounce rate, avg session duration
- Traffic sources (organic, direct, referral, social, paid)
- Top landing pages, exit pages
- Device breakdown (mobile, desktop, tablet)
- Geographic data (country, city)
- Conversion events (if configured)
- Date range: Last 30 days (default), custom ranges supported

API Quotas:
- Core: 25,000 tokens/day (free tier)
- Strategy: Cache daily, hourly incremental updates

Cached Metrics Structure in MongoDB:
- user.platforms.googleAnalytics.metrics: { sessions, users, pageviews, etc. }
- user.platforms.googleAnalytics.dimensions: { devices[], sources[], pages[], geo[] }
- user.platforms.googleAnalytics.lastSync: Date
```

**Chatbot Capabilities:**
```
User can ask:
- "How many visitors did I have last week?"
- "What's my top traffic source?"
- "Show me mobile vs desktop breakdown"
- "What's my bounce rate this month?"
- "Which pages get the most traffic?"
- "Where are my users located?"
- "How does this week compare to last week?"
```

---

#### 9.2 Google Ads

**Your Answer:**
```
API Version: Google Ads API v16
SDK/Library: google-ads-api (Node.js)
Authentication: OAuth 2.0 + Developer Token (handled in Settings)

Data to Fetch (cached in MongoDB):
- Campaign performance: impressions, clicks, CTR, conversions
- Ad spend (total, per campaign, per day)
- Cost metrics: CPA, CPC, CPM
- ROAS (Return on Ad Spend)
- Top performing keywords
- Ad group breakdown
- Date range: Last 30 days (default)

API Quotas:
- 15,000 operations/day (basic access)
- Strategy: Batch requests, cache daily aggregates

Cached Structure:
- user.platforms.googleAds.campaigns: [{ name, spend, clicks, conversions, etc. }]
- user.platforms.googleAds.keywords: [{ keyword, impressions, ctr, etc. }]
- user.platforms.googleAds.lastSync: Date
```

**Chatbot Capabilities:**
```
User can ask:
- "How much did I spend on Google Ads this month?"
- "What's my ROAS for the current campaign?"
- "Which keywords are performing best?"
- "Show me my ad click-through rate"
- "Compare this week's spend to last week"
```

---

#### 9.3 Meta/Facebook Ads

**Your Answer:**
```
API Version: Meta Marketing API v19
SDK/Library: facebook-nodejs-business-sdk
Authentication: OAuth 2.0 (handled in Settings)

Data to Fetch (cached in MongoDB):
- Ad account metrics: impressions, clicks, spend, reach
- Campaign/ad set/ad performance
- Cost metrics: CPM, CPC, CPA
- ROAS, conversion tracking
- Audience demographics (age, gender, location)
- Platform breakdown (Facebook vs Instagram)
- Date range: Last 30 days (default)

API Quotas:
- 200 calls/hour per user
- Strategy: Cache insights, hourly refresh

Cached Structure:
- user.platforms.metaAds.campaigns: [{ name, spend, impressions, cpm, etc. }]
- user.platforms.metaAds.audience: { demographics[], platforms[] }
- user.platforms.metaAds.lastSync: Date
```

**Chatbot Capabilities:**
```
User can ask:
- "How are my Facebook ads performing?"
- "What's my CPM on Instagram?"
- "Show me my Meta Ads conversion rate"
- "Who is my ad audience? (demographics)"
- "Compare Facebook vs Instagram performance"
```

---

#### 9.4 LinkedIn Ads

**Your Answer:**
```
API Version: LinkedIn Marketing API v2
SDK/Library: Custom REST API client
Authentication: OAuth 2.0 (handled in Settings)

Data to Fetch (cached in MongoDB):
- Campaign metrics: impressions, clicks, spend
- Engagement metrics: likes, comments, shares
- Lead generation data (if using lead forms)
- Demographics: job titles, industries, seniority
- Cost metrics: CPC, CPM
- Date range: Last 30 days (default)

API Quotas:
- 500,000 API calls/day
- Strategy: Cache daily, low API usage expected

Cached Structure:
- user.platforms.linkedinAds.campaigns: [{ name, spend, clicks, leads, etc. }]
- user.platforms.linkedinAds.demographics: { titles[], industries[] }
- user.platforms.linkedinAds.lastSync: Date
```

**Chatbot Capabilities:**
```
User can ask:
- "How many leads did I get from LinkedIn Ads?"
- "What's my LinkedIn Ads engagement rate?"
- "Show me my LinkedIn ad spend this month"
- "Who is clicking on my LinkedIn ads? (demographics)"
```

---

## 10. Integration Testing

**Your Answer:**
```
Testing Strategy:
- [x] Mock API responses for unit tests (Vitest)
- [x] Use demo/sample data for chatbot testing
- [x] Integration tests with test accounts (when available)
- [ ] OAuth flow tested in Settings UI (not chatbot)

Since chatbot doesn't handle OAuth, testing focuses on:
✅ Querying cached data correctly
✅ Handling missing/stale data
✅ Error messages when platforms disconnected
✅ AI's ability to interpret platform metrics

Test Data:
- Mock MongoDB data structures for each platform
- Sample conversations for AI prompt testing
- E2E tests (Playwright) for chat UI with mock data
```

---

## Additional Integration Considerations

**Your Answer:**
```
Key Points:
✅ Chatbot does NOT handle platform connections (Settings UI does)
✅ Chatbot queries cached MongoDB data only (no live API calls)
✅ Background jobs handle data syncing (hourly cron)
✅ All OAuth/token management outside chatbot scope
✅ Demo data available for users without connections

Cost Projections:
- Platform API costs: Free tiers sufficient for V1
- OpenAI costs: $11/month (covered in budget)
- No additional infra costs for chatbot integration

Future Enhancements (V2):
- Real-time data refresh option in chat
- Multi-property support
- Cross-platform comparisons ("Compare GA vs Ads ROI")
- Webhook support for instant updates
```

---

## Document Approval

**Status:** ✅ Complete

All questions answered and integration approach documented:
- [x] Engineering Lead Review
- [x] Architecture Review
- [x] Security Review (chatbot doesn't access tokens directly)
- [x] Status → ✅ Approved

**Summary:**
- Chatbot queries cached platform data from MongoDB
- Platform connections handled in Settings UI (OAuth)
- Background jobs sync data hourly
- Supports: Google Analytics, Google Ads, Meta Ads, LinkedIn Ads
- Demo data available for unconnected users

---

**Previous Document:** [03-UX-DESIGN.md](./03-UX-DESIGN.md)
**Next Document:** [05-ARCHITECTURE.md](./05-ARCHITECTURE.md)
