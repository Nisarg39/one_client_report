# Trial Configuration Verification

**Date:** December 2024  
**Status:** ✅ Verified and Confirmed

---

## Trial Limits Configuration

### Current Settings

| Setting | Value | Location |
|---------|-------|----------|
| **Trial Period** | **7 days** | `TRIAL_CONFIG.TRIAL_PERIOD_DAYS` |
| **Daily Message Limit** | **50 messages/day** | `TRIAL_CONFIG.DAILY_MESSAGE_LIMIT` |

---

## Implementation Details

### Configuration Constants

```typescript
// src/lib/utils/trialLimits.ts
export const TRIAL_CONFIG = {
  /** Trial period duration in days */
  TRIAL_PERIOD_DAYS: 7,
  /** Daily message limit during trial period */
  DAILY_MESSAGE_LIMIT: 50,
} as const;
```

### How It Works

1. **Trial Period Check:**
   - Calculates days since account creation: `Math.floor((now - createdAt) / (1000 * 60 * 60 * 24))`
   - If `daysSinceCreation >= 7` → Trial expired ❌
   - If `daysSinceCreation < 7` → Trial active ✅

2. **Daily Message Limit Check:**
   - Counts user messages sent today (UTC timezone)
   - Uses MongoDB aggregation for efficient counting
   - If `messagesToday >= 50` → Daily limit reached ❌
   - If `messagesToday < 50` → Can send more ✅

---

## Verification Checklist

### ✅ Trial Period (7 Days)

- [x] **Constant Defined:** `TRIAL_PERIOD_DAYS = 7`
- [x] **Check Logic:** `daysSinceCreation >= 7` blocks access
- [x] **Error Message:** "Your 7-day free trial has ended..."
- [x] **Days Remaining:** Calculated as `7 - daysSinceCreation`

**Test Cases:**
- Day 0 (creation day): ✅ Allowed (0 days)
- Day 1: ✅ Allowed (1 day)
- Day 6: ✅ Allowed (6 days)
- Day 7: ❌ Blocked (7 days = expired)
- Day 8+: ❌ Blocked (trial expired)

### ✅ Daily Message Limit (50 Messages)

- [x] **Constant Defined:** `DAILY_MESSAGE_LIMIT = 50`
- [x] **Check Logic:** `messagesToday >= 50` blocks access
- [x] **Error Message:** "You've reached your daily limit of 50 messages..."
- [x] **Message Counting:** Only counts `role === 'user'` messages
- [x] **Timezone:** Uses UTC for consistent daily reset

**Test Cases:**
- 0-49 messages sent today: ✅ Allowed
- 50 messages sent today: ❌ Blocked (limit reached)
- 51+ messages sent today: ❌ Blocked (limit exceeded)

---

## Code Locations

### Primary Implementation
- **File:** `src/lib/utils/trialLimits.ts`
- **Function:** `checkTrialLimits(userId: string)`
- **Constants:** `TRIAL_CONFIG`

### Usage Points
1. **Streaming Messages:**
   - `src/app/actions/chat/sendMessage.ts` (line 65)
   - Checks before processing streaming message

2. **Non-Streaming Messages:**
   - `src/app/actions/chat/sendMessage.ts` (line 459)
   - Checks before processing non-streaming message

---

## Enforcement Flow

```
User sends message
    ↓
sendMessage.ts called
    ↓
checkTrialLimits(userId)
    ↓
┌─────────────────────────┐
│ Trial Period Check      │
│ daysSinceCreation >= 7? │
└─────────────────────────┘
    ↓
    ├─ YES → ❌ Block (trial expired)
    │
    └─ NO → Continue
            ↓
    ┌──────────────────────────────┐
    │ Daily Message Limit Check    │
    │ messagesToday >= 50?         │
    └──────────────────────────────┘
            ↓
            ├─ YES → ❌ Block (daily limit reached)
            │
            └─ NO → ✅ Allow (process message)
```

---

## Error Messages

### Trial Expired
```
"Your 7-day free trial has ended. Upgrade to continue using OneAssist."
```

### Daily Limit Reached
```
"You've reached your daily limit of 50 messages. Upgrade to continue."
```

---

## Configuration Changes

To modify trial limits in the future:

1. **Update Constants:**
   ```typescript
   // src/lib/utils/trialLimits.ts
   export const TRIAL_CONFIG = {
     TRIAL_PERIOD_DAYS: 7,        // Change this
     DAILY_MESSAGE_LIMIT: 50,     // Change this
   } as const;
   ```

2. **Update Error Messages:**
   - Line 59: Trial expired message
   - Line 106: Daily limit message

3. **Update Comments:**
   - File header
   - Function documentation
   - Inline comments

---

## Testing Verification

### Manual Test Scenarios

1. **Trial Period:**
   - [ ] Create new account → Should allow messages
   - [ ] Wait 7 days → Should block with trial expired message
   - [ ] Verify days remaining calculation

2. **Daily Limit:**
   - [ ] Send 49 messages → Should allow 50th
   - [ ] Send 50th message → Should allow (limit not reached yet)
   - [ ] Try to send 51st → Should block with daily limit message
   - [ ] Wait until next day (UTC) → Should reset count

3. **Edge Cases:**
   - [ ] Message at exactly midnight UTC
   - [ ] Multiple simultaneous messages
   - [ ] User with many conversations (performance)

---

## Summary

✅ **Trial Period:** Correctly set to **7 days**  
✅ **Daily Message Limit:** Correctly set to **50 messages/day**  
✅ **Implementation:** Uses constants for easy maintenance  
✅ **Enforcement:** Applied to both streaming and non-streaming messages  
✅ **Error Handling:** Clear error messages with upgrade prompts  

**Status:** ✅ **VERIFIED AND CONFIRMED**

---

**Last Updated:** December 2024  
**Next Review:** When trial limits need to be changed






