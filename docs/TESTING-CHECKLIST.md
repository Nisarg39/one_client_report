# Hybrid Mode Testing Checklist

## Setup ✅
- [x] Dev server running at http://localhost:3000
- [x] Database migration completed
- [x] Test users created (business, education, instructor)
- [x] Mock client created for education user

---

## Test 1: Business Mode with Real Data

### Prerequisites
- Logged in as: `shah.nisarg39@gmail.com`
- Selected client: Any existing client (Nashtech, Tesla Corp, etc.)

### Test Steps

#### 1.1 Basic Chat Functionality
- [ ] Open http://localhost:3000/chat
- [ ] Verify you can see your existing clients
- [ ] Select a client with connected platforms
- [ ] Send message: "Hello, can you help me?"
- [ ] **Expected**: AI responds with Growth Strategist persona

#### 1.2 Real Data Fetching
- [ ] Send message: "What's my total traffic this month?"
- [ ] **Expected**: AI uses REAL data from Google Analytics
- [ ] **Expected**: Response includes actual numbers from your data
- [ ] **Expected**: If platform token expired, you'll see a prompt to reconnect

#### 1.3 Agent Routing (Business Mode)
Test that queries route to correct specialized agents:

- [ ] **Traffic Agent**: "How is my website traffic doing?"
  - Expected: Response focuses on traffic analysis with actual metrics

- [ ] **Ad Performance Agent**: "Analyze my ad campaigns performance"
  - Expected: Response analyzes ad performance with campaign data

- [ ] **Budget Agent**: "How should I optimize my marketing budget?"
  - Expected: Response provides budget optimization recommendations

- [ ] **Conversion Agent**: "Analyze my conversion funnel"
  - Expected: Response analyzes conversion metrics and funnel stages

#### 1.4 Growth Strategist Persona
Verify business persona characteristics:
- [ ] Responses are **direct and actionable**
- [ ] Includes format: Insight → Evidence → Execution Plan
- [ ] Uses phrases like "[Quick Win]" or "[High Impact]"
- [ ] No Socratic questions (no "What do you think?")

---

## Test 2: Education Mode with Mock Data

### Prerequisites
- Logged in as: `student@test.edu` (see "How to Test Education Mode" below)
- Selected client: "E-commerce Case Study (Mock)"

### Test Steps

#### 2.1 Mock Data Loading
- [ ] Open http://localhost:3000/chat
- [ ] Select "E-commerce Case Study (Mock)" client
- [ ] **Expected**: Chat interface loads normally
- [ ] **Expected**: No token refresh prompts (mock data doesn't need OAuth)

#### 2.2 Data Mentor Persona
- [ ] Send message: "What should I look at first?"
- [ ] **Expected**: AI uses **Socratic method** (asks guiding questions)
- [ ] **Expected**: Phrases like "Notice that..." or "What do you see when..."
- [ ] **Expected**: No direct answers, guides to discover insights

#### 2.3 Mock Scenario Data
- [ ] Send message: "Show me the traffic data"
- [ ] **Expected**: AI presents mock e-commerce data
- [ ] **Expected**: Mentions mobile vs desktop traffic
- [ ] **Expected**: Data should show ~70% mobile traffic with 72% bounce rate

#### 2.4 Learning Journey
Test the Socratic teaching flow:
- [ ] Ask: "Why is my bounce rate high?"
- [ ] **Expected**: AI asks YOU to analyze device breakdown first
- [ ] Ask: "What's the mobile bounce rate?"
- [ ] **Expected**: AI guides you to compare mobile (72%) vs desktop (35%)
- [ ] Ask: "What does this mean?"
- [ ] **Expected**: AI encourages you to form conclusion yourself

#### 2.5 Agent Routing (Education Mode)
- [ ] Ask any question about traffic, ads, budget, etc.
- [ ] **Expected**: ALL queries use Data Mentor persona (Socratic method)
- [ ] **Expected**: No matter the topic, AI guides rather than tells
- [ ] **Expected**: Consistent teaching approach across all queries

---

## Test 3: Mock Data Caching

### Prerequisites
- Still logged in as `student@test.edu`

### Test Steps

#### 3.1 First Request
- [ ] Clear browser cache and refresh
- [ ] Select mock client and send first message
- [ ] Note the specific numbers in the AI's response (e.g., "72% mobile bounce rate")

#### 3.2 Subsequent Requests
- [ ] Send another message asking for the same data
- [ ] **Expected**: Numbers are identical to first request
- [ ] **Expected**: Data is consistent across requests (cached for 24 hours)

---

## Test 4: Cross-Mode Switching

### Test Steps

#### 4.1 Business → Education
- [ ] Log in as business user, use real data
- [ ] Log out
- [ ] Log in as education user, use mock data
- [ ] **Expected**: Clean switch, no data leakage

#### 4.2 Education → Business
- [ ] Log in as education user, use mock data
- [ ] Log out
- [ ] Log in as business user, use real data
- [ ] **Expected**: Real data fetching works correctly

---

## Test 5: Error Handling

### Test Steps

#### 5.1 No Platform Connected (Business)
- [ ] Select a client with NO connected platforms
- [ ] Send message
- [ ] **Expected**: AI explains no data is connected
- [ ] **Expected**: No crash or errors

#### 5.2 Mock Data Generation Error (Education)
- [ ] (Requires simulating error - advanced test)
- [ ] **Expected**: Graceful fallback

---

## How to Test Education Mode

Since you can't actually sign in as `student@test.edu` through OAuth, here are your options:

### Option A: Temporarily Change Your Account Type (Easiest)

Run this script to temporarily make yourself an education user:

\`\`\`bash
cd "/Users/nisarg/Documents/FrontEnd Development/reactApp/one_client_report"
node -e "
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  await User.updateOne(
    { email: 'shah.nisarg39@gmail.com' },
    {
      \$set: {
        accountType: 'education',
        'restrictions.allowRealAPIs': false
      }
    }
  );
  console.log('✅ Changed to education mode');
  await mongoose.disconnect();
})();
"
\`\`\`

Then refresh your browser and test. When done, change back:

\`\`\`bash
node -e "
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  await User.updateOne(
    { email: 'shah.nisarg39@gmail.com' },
    {
      \$set: {
        accountType: 'business',
        'restrictions.allowRealAPIs': true
      }
    }
  );
  console.log('✅ Changed back to business mode');
  await mongoose.disconnect();
})();
"
\`\`\`

### Option B: Manually Set Mock Data Source

1. In your database, find one of your existing clients
2. Change its `dataSource` field from `'real'` to `'mock'`
3. Refresh and select that client
4. The system will generate mock data for you

---

## Verification Checklist

After completing all tests, verify:

- [ ] Business users get real API data
- [ ] Education users get mock scenario data
- [ ] Business mode uses Growth Strategist persona
- [ ] Education mode uses Data Mentor persona
- [ ] Agent routing works for business queries
- [ ] Education mode always routes to Data Mentor
- [ ] Mock data is cached and consistent
- [ ] No errors in browser console (except Mongoose warnings)
- [ ] No errors in server logs
- [ ] Data switching is clean with no leakage

---

## Success Criteria

✅ **PASS** if:
- All business mode tests pass with real data
- All education mode tests pass with mock data
- Personas are distinct and appropriate
- No critical errors or crashes
- Data isolation is maintained

❌ **FAIL** if:
- Business users see mock data
- Education users can access real APIs
- Wrong persona is used
- Agent routing doesn't work
- System crashes or has critical errors

---

## What to Watch in Console

### Expected Logs (Good ✅)

**Normal Operation:**
- Authentication logs: `🔐 [Auth Adapter] Using NEXTAUTH authentication`
- Database connection: `Already connected to database` or `Database connected successfully`
- HTTP requests: `GET /chat 200` and `POST /chat 200`

### Warning Logs (Expected ⚠️)
- Mongoose duplicate index warnings (cosmetic, not critical)
- Debug mode enabled warnings from next-auth

### Error Logs (Bad ❌)
- Database connection errors
- Undefined property errors
- Unhandled TypeScript errors
- API fetch failures that crash the app

---

## Reporting Issues

If you find any issues during testing, document:
1. Test step where it failed
2. Expected behavior
3. Actual behavior
4. Console logs
5. Server logs
6. Screenshots if applicable

---

**Ready to test!** Start with Test 1 (Business Mode) since you're already logged in. Good luck! 🎉
