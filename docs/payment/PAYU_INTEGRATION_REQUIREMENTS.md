# PayU Payment Gateway Integration Requirements

**Document Version**: 1.0
**Last Updated**: December 13, 2024
**Status**: Requirements Gathering Complete

---

## Overview

This document outlines the complete requirements for integrating PayU payment gateway into the One Client Report marketing analytics platform. This integration enables subscription-based billing for Professional, Agency, and Enterprise tiers.

---

## 1. Business Requirements

### 1.1 Pricing Tiers

| Plan | Price | Trial Period | Message Limit | Target Users |
|------|-------|--------------|---------------|--------------|
| **Student** | FREE (Forever) | No trial | 50 msg/day | Students learning analytics |
| **Professional** | ₹299/month | 7-day free trial | 150 msg/day | Freelancers (up to 10 clients) |
| **Agency** | ₹999/month | 7-day free trial | 300 msg/day | Agencies (up to 25 clients) |
| **Enterprise** | Custom Pricing | No trial | Unlimited | Large enterprises (100+ clients) |

### 1.2 Trial System

**Current Implementation** (`/src/lib/utils/trialLimits.ts`):
- **Trial Duration**: 7 days from account creation
- **Trial Message Limit**: 50 messages/day (enforced during trial)
- **Post-Trial Message Limits**:
  - Professional: 150 msg/day
  - Agency: 300 msg/day
  - Enterprise: Unlimited
- **Validation**: Occurs when user sends a message in `/chat` route
- **Environment**: Trial validation only runs in **production mode** (disabled in development)

**Trial Expiry Behavior**:
- User sends message → Trial validation triggered
- If expired → Popup shown with two options:
  1. **Redirect to Homepage Pricing Section** (recommended)
  2. **Stay on /chat page** (cancel button)

---

## 2. Payment Flow Requirements

### 2.1 User Journey: Trial Expiry → Payment

```
User Trial Expires (7 days)
    ↓
User sends message in /chat
    ↓
Trial validation fails
    ↓
Popup shown: "Trial expired - Redirect to pricing or stay?"
    ↓
User clicks "Go to Pricing"
    ↓
Redirected to Homepage #pricing section
    ↓
Pricing section detects trial expired
    ↓
Shows "Subscribe Now" buttons (NOT "Start Free Trial")
    ↓
User clicks "Subscribe Now" for Professional/Agency
    ↓
Redirected to: /subscribe/[plan] (dynamic route)
    ↓
Payment page with PayU integration
    ↓
Payment success → Subscription activated
```

### 2.2 User Journey: Student Upgrade (Anytime)

```
Student user (no trial, 50 msg/day on mock data)
    ↓
Wants to upgrade (can happen anytime)
    ↓
Goes to Homepage #pricing section
    ↓
Clicks "Subscribe Now" for Professional/Agency/Enterprise
    ↓
Redirected to: /subscribe/[plan]
    ↓
Payment process
```

### 2.3 User Journey: Business User Upgrade (Post-Trial)

```
Business user with real API data
    ↓
7-day trial expires
    ↓
Same flow as 2.1 (trial expiry flow)
    ↓
Can choose Professional/Agency/Enterprise
```

---

## 3. Integration Method: **Checkout Plus** (Recommended)

**Selected Integration**: **Checkout Plus**

### Why Checkout Plus?

Based on the PayU documentation screenshot and requirements for best conversion:

1. **Redirectionless Experience**: Payment modal appears on your site (user never leaves)
2. **Higher Conversion**: Users don't experience jarring redirect flow
3. **Better UX**: Seamless payment within your application
4. **Optimal for SaaS**: Best suited for subscription-based products
5. **Complex but Worth It**: Provides best user experience despite implementation complexity

**Technical Details**:
- **Method**: Modal popup payment on your website
- **No Redirection**: Customer stays on your domain throughout
- **PayU SDK**: Requires PayU JavaScript SDK integration
- **Hash Generation**: Server-side hash generation (security)
- **Callback Handling**: Webhook + client-side callback

**Alternative Considered**:
- **PayU Hosted Checkout**: Simpler but requires full page redirect (lower conversion)
- **Checkout Express**: More complex, overkill for current needs

---

## 4. Dynamic Payment Route Structure

### Route: `/subscribe/[plan]`

**Dynamic Parameters**:
- `[plan]`: `professional` | `agency` | `enterprise`

**Examples**:
- `/subscribe/professional` → ₹299/month payment page
- `/subscribe/agency` → ₹999/month payment page
- `/subscribe/enterprise` → Contact sales form (no payment)

**Unified Payment Page Features**:
- Displays plan details based on dynamic param
- Shows pricing, features, billing cycle
- PayU Checkout Plus integration (modal)
- Payment success/failure handling
- Order confirmation

---

## 5. Subscription Management Features

### 5.1 Required Features

✅ **Must Have**:
1. **Cancel Subscription**: User can cancel their active subscription
2. **View Payment History**: List of all past payments
3. **Download Invoices**: PDF invoice for each payment
4. **View Current Plan**: See active plan and expiry date

❌ **Not Required (Phase 1)**:
- No auto-renewal system
- No automatic recurring billing
- No saved payment methods

### 5.2 Subscription Expiry System

**Similar to Trial Validation**:

```javascript
// Similar to checkTrialLimits() in /src/lib/utils/trialLimits.ts
checkSubscriptionLimits(userId) {
  // Check if subscription is active
  // If expired:
  //   - Show popup: "Subscription ended"
  //   - Option 1: "Renew Subscription" (redirect to /subscribe/[current_plan])
  //   - Option 2: "Cancel" (stay on /chat page)
}
```

**Validation Points**:
- When user sends message in `/chat`
- Only in **production environment** (disabled in development)
- Similar popup UX as trial expiry

---

## 6. User Type-Specific Behavior

### 6.1 Student Users (accountType: 'education')

**Characteristics**:
- `usageTier`: 'student'
- No trial period
- 50 messages/day limit (forever free)
- Mock data only (no real API connections)

**Payment Behavior**:
- Can upgrade to Professional, Agency, or Enterprise **anytime**
- No trial restrictions blocking upgrade
- Pricing page shows "Subscribe Now" buttons (no trial mentioned)

### 6.2 Business Users (accountType: 'business')

**Characteristics**:
- `usageTier`: 'pro' or 'agency' (starts as 'pro' during trial)
- 7-day trial period
- Real API data connections allowed
- Post-trial: 150 msg/day (pro) or 300 msg/day (agency)

**Payment Behavior**:
- During trial: "Start Free Trial" button (if not already activated)
- After trial expires: "Subscribe Now" button
- Can choose Professional, Agency, or Enterprise after trial

---

## 7. Enterprise Plan Behavior

### Special Handling for Enterprise

**When User Clicks Enterprise "Subscribe Now" Button**:
- **DO NOT** redirect to `/subscribe/enterprise`
- **INSTEAD**: Smooth scroll to "Get in Touch" section on homepage
- No payment integration for Enterprise (custom pricing via sales)

**Implementation**:
```javascript
// On Enterprise plan button click
if (plan === 'enterprise') {
  // Smooth scroll to #get-in-touch section
  document.querySelector('#get-in-touch').scrollIntoView({
    behavior: 'smooth'
  });
} else {
  // Redirect to /subscribe/[plan]
  router.push(`/subscribe/${plan}`);
}
```

---

## 8. Database Schema Requirements

### 8.1 Subscription Model (NEW)

**File**: `/src/models/Subscription.ts`

```typescript
interface ISubscription {
  userId: ObjectId;

  // Subscription Status
  status: 'active' | 'expired' | 'cancelled';
  usageTier: 'professional' | 'agency' | 'enterprise';

  // PayU Integration
  payuOrderId: string;          // PayU transaction ID
  payuCustomerId?: string;      // PayU customer ID (if available)

  // Billing Period
  startDate: Date;              // Subscription start date
  endDate: Date;                // Subscription end date (1 month from start)

  // Payment Details
  amount: number;               // Amount paid (299 or 999)
  currency: string;             // 'INR'

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

### 8.2 Payment History Model (NEW)

**File**: `/src/models/PaymentHistory.ts`

```typescript
interface IPaymentHistory {
  userId: ObjectId;
  subscriptionId: ObjectId;     // Reference to subscription

  // PayU Details
  payuOrderId: string;
  payuTransactionId: string;    // mihpayid from PayU

  // Payment Info
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  paymentMethod: string;        // UPI, Card, NetBanking, etc.

  // Invoice
  invoiceNumber: string;        // Generated invoice number
  invoiceUrl?: string;          // URL to PDF invoice (if generated)

  // Timestamps
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 8.3 User Model Updates (MODIFY EXISTING)

**File**: `/src/models/User.ts`

**Add New Fields**:
```typescript
interface IUser {
  // ... existing fields ...

  // Payment & Subscription (NEW)
  currentSubscriptionId?: ObjectId;   // Active subscription reference
  subscriptionStatus: 'none' | 'trial' | 'active' | 'expired';
  subscriptionEndDate?: Date;         // When current subscription expires

  // Trial Tracking (MODIFY)
  trialStartDate?: Date;              // When trial started (createdAt for now)
  trialEndDate?: Date;                // When trial ends (createdAt + 7 days)
  hasUsedTrial: boolean;              // Prevent multiple trials
}
```

---

## 9. API Routes Required

### 9.1 Payment Initiation

**Route**: `POST /api/payu/create-order`

**Purpose**: Generate PayU order and hash for payment initiation

**Input**:
```json
{
  "plan": "professional" | "agency",
  "userId": "user_id"
}
```

**Output**:
```json
{
  "orderId": "ORDER_20241213_123456",
  "amount": 299,
  "hash": "generated_sha512_hash",
  "key": "merchant_key",
  "txnid": "TXN_20241213_123456",
  "productinfo": "Professional Plan - 1 Month",
  "firstname": "User Name",
  "email": "user@example.com",
  "phone": "9876543210",
  "surl": "https://yourapp.com/api/payu/success",
  "furl": "https://yourapp.com/api/payu/failure"
}
```

### 9.2 Payment Success Callback

**Route**: `POST /api/payu/success`

**Purpose**: Handle successful payment callback from PayU

**Actions**:
1. Verify hash from PayU response
2. Create subscription record in database
3. Update user's `usageTier` and `subscriptionStatus`
4. Create payment history record
5. Generate invoice
6. Send confirmation email
7. Return success page data

### 9.3 Payment Failure Callback

**Route**: `POST /api/payu/failure`

**Purpose**: Handle failed payment callback

**Actions**:
1. Log failure reason
2. Update payment history (status: 'failed')
3. Return error page data

### 9.4 Webhook Handler

**Route**: `POST /api/payu/webhook`

**Purpose**: Server-to-server payment confirmation (reliable)

**Actions**:
- Same as success callback but server-to-server
- Verify hash
- Update database
- Return 200 OK to PayU

### 9.5 Subscription Management APIs

```
GET  /api/subscription/current        - Get current active subscription
POST /api/subscription/cancel         - Cancel subscription
GET  /api/subscription/history        - Get payment history
GET  /api/subscription/invoice/:id    - Download invoice PDF
```

---

## 10. Frontend Components Required

### 10.1 Modified Components

**File**: `/src/components/features/pricing-transparency.tsx`

**Changes**:
1. Accept `trialExpired` prop (boolean)
2. If `trialExpired === true`:
   - Change button text: "Subscribe Now" (instead of "Start Free Trial")
   - Change button action: Redirect to `/subscribe/[plan]`
3. Enterprise button: Scroll to #get-in-touch section

### 10.2 New Components

**1. Subscribe Page** (`/src/app/subscribe/[plan]/page.tsx`)
- Dynamic plan-based subscription page
- PayU Checkout Plus integration
- Order summary
- Payment modal trigger

**2. PayU Checkout Component** (`/src/components/payment/PayuCheckout.tsx`)
- PayU SDK integration
- Modal payment form
- Loading states
- Success/failure handling

**3. Subscription Dashboard** (`/src/app/dashboard/subscription/page.tsx`)
- View current plan
- Payment history table
- Download invoices
- Cancel subscription button

**4. Payment Success Page** (`/src/app/subscribe/success/page.tsx`)
- Order confirmation
- Display invoice
- Next steps

**5. Payment Failure Page** (`/src/app/subscribe/failure/page.tsx`)
- Error message
- Retry button
- Support contact

---

## 11. Environment Variables

**Required `.env` Variables**:

```bash
# PayU Configuration
PAYU_MERCHANT_KEY=your_test_key          # Test mode key
PAYU_MERCHANT_SALT=your_test_salt        # Test mode salt
PAYU_MODE=test                           # 'test' or 'production'

# PayU URLs (based on mode)
PAYU_BASE_URL=https://test.payu.in       # Test: test.payu.in, Live: secure.payu.in

# Callback URLs
PAYU_SUCCESS_URL=https://yourapp.com/api/payu/success
PAYU_FAILURE_URL=https://yourapp.com/api/payu/failure
PAYU_WEBHOOK_URL=https://yourapp.com/api/payu/webhook

# App URLs
NEXT_PUBLIC_APP_URL=https://yourapp.com
```

---

## 12. Security Requirements

### 12.1 Hash Generation (Critical)

**Server-Side Only**:
- NEVER expose `PAYU_MERCHANT_SALT` to client
- Hash generation MUST happen on backend API route
- Use SHA-512 algorithm

**Request Hash Format**:
```
key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
```

**Response Hash Verification** (reverse order):
```
SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
```

### 12.2 Webhook Verification

1. Verify hash in webhook callback
2. Verify transaction ID matches database record
3. Verify amount matches expected amount
4. Idempotency: Prevent duplicate processing of same transaction

---

## 13. Trial vs Subscription Logic

### 13.1 Current Trial Logic

**File**: `/src/lib/utils/trialLimits.ts`

**Current Behavior**:
```javascript
if (user.usageTier === 'pro' || user.usageTier === 'agency') {
  if (daysSinceCreation >= 7) {
    // Trial expired - block access
    return { allowed: false, reason: 'trial_expired' };
  }
}
```

### 13.2 New Subscription Logic

**New File**: `/src/lib/utils/subscriptionLimits.ts`

**New Behavior**:
```javascript
// Check subscription status (after trial)
if (user.subscriptionStatus === 'expired' || user.subscriptionStatus === 'none') {
  const now = new Date();
  const trialEndDate = addDays(user.createdAt, 7);

  if (now > trialEndDate) {
    // Trial + Subscription both expired
    return { allowed: false, reason: 'subscription_expired' };
  }
}

// If subscription is active, check end date
if (user.subscriptionStatus === 'active') {
  if (now > user.subscriptionEndDate) {
    // Subscription expired (manual renewal needed)
    return { allowed: false, reason: 'subscription_expired' };
  }
}
```

---

## 14. Testing Strategy

### 14.1 Test Environment

**PayU Test Mode**:
- Use test merchant key and salt
- Use PayU test URLs: `https://test.payu.in`
- Test payment page has fake card numbers for testing

**Test Scenarios**:
1. ✅ Student upgrades to Professional
2. ✅ Business user trial expires → subscribes to Professional
3. ✅ Business user trial expires → subscribes to Agency
4. ✅ Payment success flow
5. ✅ Payment failure flow
6. ✅ Subscription expiry after 1 month
7. ✅ Subscription renewal
8. ✅ Subscription cancellation
9. ✅ Invoice generation
10. ✅ Webhook delivery and verification

### 14.2 Edge Cases

- User closes payment modal mid-transaction
- User pays twice for same order (idempotency)
- Webhook arrives before redirect callback
- Hash verification failure
- Invalid plan parameter in URL
- Network timeout during payment

---

## 15. Success Metrics

### 15.1 Conversion Funnel

```
Trial Users → Trial Expired → Viewed Pricing → Started Payment → Completed Payment
```

**Target Conversion Rates**:
- Trial Expired → Viewed Pricing: 80%
- Viewed Pricing → Started Payment: 30%
- Started Payment → Completed Payment: 85%

### 15.2 Analytics Events

Track these events:
- `trial_expired` - When trial expires
- `viewed_pricing` - User views pricing section
- `clicked_subscribe` - User clicks Subscribe Now button
- `payment_initiated` - Payment modal opened
- `payment_success` - Payment completed
- `payment_failed` - Payment failed
- `subscription_cancelled` - User cancelled subscription

---

## 16. Future Enhancements (Not in Phase 1)

**Phase 2 (Future)**:
- Auto-renewal with saved payment methods
- Annual billing option (discounted)
- Proration for plan upgrades/downgrades
- Team member management for Agency plan
- Usage-based billing
- Payment reminders (email)
- Dunning management (failed payment retries)

---

## 17. Rollout Plan

### Phase 1: Core Payment Flow
1. Database models
2. PayU integration (Checkout Plus)
3. `/subscribe/[plan]` payment page
4. Success/failure handling
5. Basic subscription tracking

### Phase 2: Subscription Management
1. Subscription expiry validation
2. Cancel subscription
3. Payment history
4. Invoice generation

### Phase 3: Polish & Optimization
1. Email notifications
2. Analytics tracking
3. Error monitoring
4. Performance optimization

---

## 18. Dependencies

**Required npm Packages**:
```json
{
  "crypto": "built-in",           // For SHA-512 hash generation
  "axios": "^1.6.0",              // For PayU API calls (optional)
  "pdfkit": "^0.13.0",            // For invoice PDF generation
  "nodemailer": "^6.9.0"          // For email notifications
}
```

---

## 19. Documentation References

**PayU Official Docs**:
- Checkout Plus: https://docs.payu.in/docs/checkout-plus
- Hash Generation: https://docs.payu.in/docs/generate-hash
- Webhooks: https://docs.payu.in/docs/webhooks
- Test Credentials: Contact PayU support

**Internal Docs**:
- Trial System: `/src/lib/utils/trialLimits.ts`
- User Model: `/src/models/User.ts`
- Pricing Component: `/src/components/features/pricing-transparency.tsx`

---

## 20. Support & Maintenance

**Payment Issues Escalation**:
1. Check PayU dashboard for transaction status
2. Verify webhook delivery in logs
3. Check database subscription status
4. Contact PayU support if needed

**Common Issues**:
- Hash mismatch: Check salt and hash generation order
- Webhook not received: Verify URL is publicly accessible
- Payment stuck: Check PayU dashboard transaction status

---

## Approval & Sign-off

**Requirements Defined By**: User (Nash)
**Date**: December 13, 2024
**Status**: ✅ Approved for Implementation

**Next Steps**:
1. Review and approve this requirements document
2. Create detailed technical implementation plan
3. Begin development in phases

---

**End of Requirements Document**
