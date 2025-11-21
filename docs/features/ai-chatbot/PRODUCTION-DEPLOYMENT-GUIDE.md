# Production Deployment Guide

**Document Version:** 1.0
**Last Updated:** 2025-11-22
**Estimated Setup Time:** 4-6 hours
**Prerequisites:** Node.js 18+, Git, Vercel account

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Redis (Upstash) Setup](#redis-upstash-setup)
4. [OAuth Configuration](#oauth-configuration)
5. [OpenAI API Setup](#openai-api-setup)
6. [Vercel Deployment](#vercel-deployment)
7. [Environment Variables](#environment-variables)
8. [Database Migration](#database-migration)
9. [Domain & SSL](#domain--ssl)
10. [Monitoring Setup](#monitoring-setup)
11. [Post-Deployment Verification](#post-deployment-verification)

---

## Prerequisites

### Required Tools

```bash
# 1. Node.js (v18 or higher)
node --version  # Should be v18+

# 2. npm or yarn
npm --version

# 3. Git
git --version

# 4. Vercel CLI (optional but recommended)
npm install -g vercel
```

### Required Accounts

- [ ] Vercel account (https://vercel.com/signup)
- [ ] MongoDB Atlas account (https://www.mongodb.com/cloud/atlas/register)
- [ ] Upstash account (https://upstash.com)
- [ ] Google Cloud Platform account (for OAuth & Analytics)
- [ ] Meta for Developers account (for Meta Ads)
- [ ] OpenAI account (for AI features)

---

## MongoDB Atlas Setup

### Step 1: Create Cluster

1. Go to https://cloud.mongodb.com
2. Click "Create" → "Deploy a cloud database"
3. Choose **M0 (Free Tier)** for testing or **M10+** for production
4. Select cloud provider: **AWS** (recommended)
5. Select region: **Choose closest to your users**
6. Cluster name: `oneclient-prod`
7. Click "Create Cluster"

### Step 2: Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict to Vercel IPs
4. Click "Confirm"

### Step 3: Create Database User

1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Choose authentication method: **Password**
4. Username: `oneclient-admin`
5. Password: Generate secure password (save this!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### Step 4: Get Connection String

1. Go to **Databases** (left sidebar)
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Driver: **Node.js** version **4.1 or later**
5. Copy the connection string:

```
mongodb+srv://oneclient-admin:<password>@oneclient-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. Replace `<password>` with your actual password
7. Save this connection string for later

---

## Redis (Upstash) Setup

### Step 1: Create Redis Database

1. Go to https://console.upstash.com
2. Click "Create Database"
3. Name: `oneclient-redis`
4. Type: **Regional** (cheaper) or **Global** (lower latency)
5. Region: **Choose closest to your users**
6. Click "Create"

### Step 2: Get Credentials

1. Click on your database name
2. Copy the following:
   - **REST URL**: `https://your-redis.upstash.io`
   - **REST Token**: `AxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ==`

3. Save these for environment variables

---

## OAuth Configuration

### Google OAuth (for Login + Analytics)

#### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Project name: `OneClient Production`
4. Click "Create"

#### Step 2: Enable APIs

1. Go to "APIs & Services" → "Library"
2. Search and enable the following APIs:
   - **Google+ API** (for login)
   - **Google Analytics Data API**
   - **Google Ads API** (if using Google Ads)

#### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. User Type: **External**
3. Click "Create"
4. App information:
   - App name: `OneClient`
   - User support email: Your email
   - Developer contact: Your email
5. Scopes: Click "Add or Remove Scopes"
   - Add: `.../auth/userinfo.email`
   - Add: `.../auth/userinfo.profile`
   - Add: `.../auth/analytics.readonly`
6. Test users: Add your email
7. Click "Save and Continue"

#### Step 4: Create OAuth Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `OneClient Web Client`
5. Authorized JavaScript origins:
   ```
   https://your-domain.com
   ```
6. Authorized redirect URIs:
   ```
   https://your-domain.com/api/auth/callback/google
   ```
7. Click "Create"
8. Copy **Client ID** and **Client Secret**

### Meta (Facebook) OAuth

#### Step 1: Create Meta App

1. Go to https://developers.facebook.com
2. Click "My Apps" → "Create App"
3. Use case: **Business**
4. App name: `OneClient`
5. App contact email: Your email
6. Click "Create App"

#### Step 2: Add Facebook Login

1. In app dashboard, click "Add Product"
2. Find "Facebook Login" → Click "Set Up"
3. Platform: **Web**
4. Site URL: `https://your-domain.com`
5. Save

#### Step 3: Configure OAuth Settings

1. Go to "Facebook Login" → "Settings"
2. Valid OAuth Redirect URIs:
   ```
   https://your-domain.com/api/auth/callback/facebook
   ```
3. Save changes

#### Step 4: Get App Credentials

1. Go to "Settings" → "Basic"
2. Copy **App ID** and **App Secret**
3. App Domains: `your-domain.com`
4. Privacy Policy URL: `https://your-domain.com/privacy`
5. Terms of Service URL: `https://your-domain.com/terms`

### LinkedIn OAuth

#### Step 1: Create LinkedIn App

1. Go to https://www.linkedin.com/developers/apps
2. Click "Create app"
3. App name: `OneClient`
4. LinkedIn Page: Select your company page
5. App logo: Upload logo
6. Click "Create app"

#### Step 2: Configure Auth Settings

1. Go to "Auth" tab
2. Authorized redirect URLs:
   ```
   https://your-domain.com/api/auth/callback/linkedin
   ```
3. Copy **Client ID** and **Client Secret**

---

## OpenAI API Setup

### Step 1: Create API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name: `OneClient Production`
4. Copy the key (starts with `sk-...`)
   - ⚠️ **Save this immediately - you won't see it again!**

### Step 2: Set Up Billing

1. Go to https://platform.openai.com/account/billing
2. Add payment method
3. Set usage limits (recommended):
   - Soft limit: $50/month
   - Hard limit: $100/month

---

## Vercel Deployment

### Step 1: Connect GitHub Repository

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 2: Configure Build Settings

```bash
# In Vercel dashboard → Settings → General

Node.js Version: 18.x
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

### Step 3: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables, add all variables from the [Environment Variables](#environment-variables) section below.

---

## Environment Variables

### Complete .env.production

Create these in Vercel dashboard (Settings → Environment Variables):

```bash
# ============================================
# Application
# ============================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
APP_VERSION=1.0.0

# ============================================
# Database
# ============================================
MONGODB_URI=mongodb+srv://oneclient-admin:<password>@oneclient-prod.xxxxx.mongodb.net/oneclient?retryWrites=true&w=majority

# ============================================
# Redis (Upstash)
# ============================================
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=AxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ==

# ============================================
# Authentication (NextAuth)
# ============================================
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-random-32-char-string>

# Generate NEXTAUTH_SECRET:
# Run: openssl rand -base64 32

# ============================================
# Google OAuth & Analytics
# ============================================
GOOGLE_OAUTH_CLIENT_ID=101955302048-xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxx

GOOGLE_ANALYTICS_CLIENT_ID=<same-as-above>
GOOGLE_ANALYTICS_CLIENT_SECRET=<same-as-above>

# ============================================
# Google Ads
# ============================================
GOOGLE_ADS_CLIENT_ID=<your-google-ads-client-id>
GOOGLE_ADS_CLIENT_SECRET=<your-google-ads-client-secret>
GOOGLE_ADS_DEVELOPER_TOKEN=<your-developer-token>

# ============================================
# Meta (Facebook) Ads
# ============================================
META_APP_ID=<your-meta-app-id>
META_APP_SECRET=<your-meta-app-secret>

# ============================================
# LinkedIn Ads
# ============================================
LINKEDIN_CLIENT_ID=<your-linkedin-client-id>
LINKEDIN_CLIENT_SECRET=<your-linkedin-client-secret>

# ============================================
# OpenAI
# ============================================
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4  # or gpt-3.5-turbo for lower cost

# ============================================
# Security
# ============================================
PLATFORM_CREDENTIALS_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef
# Generate: openssl rand -hex 32

# ============================================
# Monitoring (Optional)
# ============================================
SENTRY_DSN=https://xxxxxx@sentry.io/xxxxxx
SENTRY_AUTH_TOKEN=<your-sentry-auth-token>

# ============================================
# Analytics (Optional)
# ============================================
NEXT_PUBLIC_MIXPANEL_TOKEN=<your-mixpanel-token>
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-key>
```

### How to Generate Secure Secrets

```bash
# NEXTAUTH_SECRET (32 characters)
openssl rand -base64 32

# PLATFORM_CREDENTIALS_ENCRYPTION_KEY (64 hex characters)
openssl rand -hex 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Database Migration

### Run Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/your-username/oneclient.git
cd oneclient

# 2. Install dependencies
npm install

# 3. Create .env.local with production values
cp .env.example .env.local
# Edit .env.local with your production credentials

# 4. Test database connection
npm run db:test

# Expected output:
# ✅ Connected to MongoDB successfully
# Database: oneclient
# Collections: []

# 5. Seed demo data (optional, for testing)
npm run db:seed

# Expected output:
# ✅ Created 3 demo clients
# ✅ Created 5 demo conversations
```

### Database Indexes

The indexes will be created automatically when the models are first used. To manually create them:

```bash
npm run db:create-indexes

# Expected output:
# ✅ Created indexes for User model
# ✅ Created indexes for Client model
# ✅ Created indexes for Conversation model
# ✅ Created indexes for PlatformConnection model
```

---

## Domain & SSL

### Option 1: Use Vercel Domain

Your project is automatically available at:
```
https://your-project.vercel.app
```

SSL is automatically configured.

### Option 2: Custom Domain

1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain: `your-domain.com`
3. Configure DNS:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

4. Wait for DNS propagation (5-60 minutes)
5. SSL certificate will be auto-provisioned

---

## Monitoring Setup

### Sentry (Error Tracking)

1. Go to https://sentry.io/signup
2. Create new project → **Next.js**
3. Copy DSN: `https://xxxxxx@sentry.io/xxxxxx`
4. Add to Vercel environment variables:
   ```
   SENTRY_DSN=https://xxxxxx@sentry.io/xxxxxx
   ```

### Vercel Analytics

1. Go to Vercel dashboard → Analytics
2. Click "Enable Analytics"
3. No configuration needed - automatically tracks:
   - Page views
   - Core Web Vitals
   - Real User Monitoring

### UptimeRobot (Uptime Monitoring)

1. Go to https://uptimerobot.com/signUp
2. Add New Monitor:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `OneClient Production`
   - URL: `https://your-domain.com/api/health`
   - Monitoring Interval: **5 minutes**
3. Set up alerts:
   - Email: Your email
   - SMS: Your phone (optional)

---

## Post-Deployment Verification

### 1. Health Check

```bash
curl https://your-domain.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-11-22T10:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "ai": "healthy"
  }
}
```

### 2. Test OAuth Flows

#### Google OAuth

1. Go to `https://your-domain.com/login`
2. Click "Sign in with Google"
3. Verify redirect to Google
4. Authorize the app
5. Verify redirect back to `/chat`

#### Meta OAuth

1. Create a client
2. Go to platform connection step
3. Click "Connect Meta Ads"
4. Verify OAuth flow completes

### 3. Test Chat Functionality

1. Send a test message: "Hello, how are you?"
2. Verify AI response within 3 seconds
3. Check conversation is saved in database

### 4. Test Platform Integration

1. Connect Google Analytics
2. Query data: "Show me last 7 days of traffic"
3. Verify data is fetched and displayed

### 5. Performance Check

```bash
# Run Lighthouse audit
npm install -g lighthouse

lighthouse https://your-domain.com --view

# Targets:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 90+
```

### 6. Security Check

```bash
# Check SSL
curl -I https://your-domain.com | grep -i strict

# Expected:
# strict-transport-security: max-age=63072000

# Check security headers
curl -I https://your-domain.com

# Should include:
# x-frame-options: DENY
# x-content-type-options: nosniff
# x-xss-protection: 1; mode=block
```

---

## Troubleshooting

### Issue: Database Connection Failed

```bash
# Error: MongoServerError: Authentication failed

# Solution:
1. Verify MongoDB connection string is correct
2. Check username and password have no special characters
   (if they do, URL-encode them)
3. Verify IP whitelist includes 0.0.0.0/0 or Vercel IPs
4. Test connection locally first
```

### Issue: OAuth Redirect Mismatch

```bash
# Error: redirect_uri_mismatch

# Solution:
1. Go to Google Cloud Console → Credentials
2. Edit OAuth Client
3. Verify Authorized redirect URIs includes:
   https://your-domain.com/api/auth/callback/google
4. Save and wait 5 minutes for changes to propagate
```

### Issue: Environment Variables Not Loading

```bash
# Error: process.env.MONGODB_URI is undefined

# Solution:
1. Verify environment variables are set in Vercel dashboard
2. Redeploy the application (changes require redeployment)
3. Check variable names match exactly (case-sensitive)
```

### Issue: Build Fails on Vercel

```bash
# Error: Build failed with exit code 1

# Solution:
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in package.json
3. Test build locally: npm run build
4. Check Node.js version matches (18.x)
```

---

## Maintenance

### Weekly Tasks

- [ ] Review error logs in Sentry
- [ ] Check uptime reports from UptimeRobot
- [ ] Monitor API usage (OpenAI, platform APIs)
- [ ] Review user feedback/support tickets

### Monthly Tasks

- [ ] Update dependencies: `npm update`
- [ ] Review and optimize database indexes
- [ ] Audit OAuth tokens for expired/revoked ones
- [ ] Check SSL certificate expiration
- [ ] Review and optimize costs

### Quarterly Tasks

- [ ] Security audit: `npm audit`
- [ ] Performance review and optimization
- [ ] Database backup verification
- [ ] Disaster recovery drill

---

## Backup & Disaster Recovery

### Database Backups

MongoDB Atlas automatic backups:
1. Go to MongoDB Atlas → Clusters
2. Click cluster → Backup
3. Backups run automatically every 24 hours
4. Retention: 7 days (free tier), configurable (paid)

### Manual Backup

```bash
# Export database
mongodump --uri="mongodb+srv://..." --out=./backup-$(date +%Y%m%d)

# Restore database
mongorestore --uri="mongodb+srv://..." ./backup-20251122
```

### Application Backup

All code is in Git - no additional backup needed.
Vercel keeps deployment history for rollbacks.

---

## Cost Estimate

### Monthly Costs (Production)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20/month |
| MongoDB Atlas | M10 Shared | $57/month |
| Upstash Redis | Free or Pay-as-you-go | $0-10/month |
| OpenAI API | GPT-3.5 Turbo | $20-100/month |
| Google Cloud | OAuth + APIs | $0 (free tier) |
| Sentry | Team | $26/month |
| **Total** | | **~$123-213/month** |

### Cost Optimization Tips

1. Use GPT-3.5 Turbo instead of GPT-4 (10x cheaper)
2. Implement aggressive caching (reduce API calls)
3. Use MongoDB M0 free tier for staging
4. Start with Upstash free tier
5. Self-host error tracking instead of Sentry

---

## Next Steps

After successful deployment:

1. ✅ Test all functionality
2. ✅ Invite beta users
3. ✅ Gather feedback
4. ✅ Monitor for 1 week
5. ✅ Plan feature improvements
6. ✅ Market your application!

**Congratulations! Your AI chatbot is now live in production! 🎉**

---

For support or questions, refer to:
- [Implementation Roadmap](./08-IMPLEMENTATION-ROADMAP-COMPLETE.md)
- [Testing Strategy](./PHASE-7-LAUNCH.md)
- [API Documentation](./07-API-DESIGN-COMPLETE.md)
