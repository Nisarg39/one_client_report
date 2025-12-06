# Mock Data Generation Guide

**Last Updated:** December 2, 2024
**Status:** 📝 Specification

---

## Overview

The mock data generator creates realistic marketing analytics data for education mode. This allows students to practice data analysis without needing real platform connections or exposing actual client data.

**Key Principle:** Mock data must be indistinguishable from real API responses in structure, but intentionally contain learnable patterns and issues.

---

## Architecture

### Data Flow

```
Student creates workspace
        ↓
Client.dataSource = 'mock'
        ↓
Student opens chat
        ↓
sendMessage.ts fetches platform data
        ↓
dataFetcher.ts checks dataSource
        ↓
Scenario assigned? → Load from DB
No scenario? → Generate from template
        ↓
Return mock data (same structure as real APIs)
        ↓
AI analyzes mock data
        ↓
Student receives insights
```

---

## Generator Service

### Location
**File:** `/src/lib/platforms/mock/generator.ts`

### Core Function

```typescript
export function generateMockPlatformData(
  scenario: MockScenarioTemplate
): PlatformData {
  return {
    googleAnalyticsMulti: generateMockGA4Data(scenario.gaConfig),
    googleAds: generateMockGoogleAdsData(scenario.adsConfig),
    metaAds: generateMockMetaAdsData(scenario.metaConfig),
    linkedInAds: generateMockLinkedInAdsData(scenario.linkedInConfig),
  };
}
```

**Input:** Scenario template configuration
**Output:** Platform data matching real API response structure

---

## Scenario Templates

### Template Structure

```typescript
interface MockScenarioTemplate {
  // Metadata
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  industry: 'ecommerce' | 'saas' | 'b2b' | 'local' | 'nonprofit';

  // Learning objectives
  learningObjectives: string[];
  keyInsights: string[];          // What students should discover
  commonMistakes: string[];       // What students often miss

  // Platform configs
  gaConfig?: GAMockConfig;
  adsConfig?: AdsMockConfig;
  metaConfig?: MetaMockConfig;
  linkedInConfig?: LinkedInMockConfig;

  // Difficulty modifiers
  noiseLevel?: number;            // 0-1: Add random variance
  issueObviousness?: number;      // 0-1: How obvious is the problem
}
```

---

## Pre-Built Scenarios

### 1. Beginner: E-commerce High Bounce Rate

**File:** `SCENARIO_TEMPLATES.beginnerEcommerce`

**Learning Objectives:**
- Identify high bounce rate
- Analyze device breakdown
- Understand mobile optimization impact

**Key Issue:** 72% bounce rate on mobile (vs 35% on desktop)

**Configuration:**
```typescript
{
  name: "E-commerce Basics: High Bounce Rate",
  difficulty: "beginner",
  industry: "ecommerce",

  gaConfig: {
    websiteName: "FashionStore.com",
    sessionsRange: [15000, 20000],
    usersRange: [12000, 16000],

    // Overall metrics
    bounceRate: 0.58,  // High but not obviously broken

    // Device breakdown (this is the key insight)
    deviceMix: {
      mobile: {
        percentage: 70,
        bounceRate: 0.72,     // Very high - mobile issue!
        avgSessionDuration: 25
      },
      desktop: {
        percentage: 25,
        bounceRate: 0.35,     // Normal
        avgSessionDuration: 180
      },
      tablet: {
        percentage: 5,
        bounceRate: 0.42,
        avgSessionDuration: 90
      }
    },

    // Traffic sources (normal distribution)
    trafficSources: [
      { source: 'google', medium: 'organic', sessions: 8000 },
      { source: 'facebook', medium: 'social', sessions: 4500 },
      { source: 'direct', medium: 'none', sessions: 2500 }
    ]
  }
}
```

**Expected Student Discovery:**
1. Overall bounce rate is 58% (seems okay)
2. But 70% of traffic is mobile
3. Mobile bounce rate is 72% (very high!)
4. **Conclusion:** Mobile UX is broken, needs optimization

---

### 2. Intermediate: Google Ads CPC Crisis

**File:** `SCENARIO_TEMPLATES.intermediateAds`

**Learning Objectives:**
- Calculate cost per acquisition (CPA)
- Identify inefficient campaigns
- Recommend budget reallocation

**Key Issue:** Generic keyword campaign has 8.5x higher CPC but same conversion rate

**Configuration:**
```typescript
{
  name: "Google Ads: CPC Crisis",
  difficulty: "intermediate",
  industry: "saas",

  adsConfig: {
    totalBudget: 15000,
    dateRange: "Last 30 days",

    campaigns: [
      {
        id: "1",
        name: "Brand Campaign",
        status: "active",
        budget: 3000,
        spend: 2850,
        impressions: 125000,
        clicks: 3200,
        conversions: 45,
        cpc: 0.89,       // Good CPC
        ctr: 2.56,       // Good CTR
        conversionRate: 1.41  // Good conversion rate
      },
      {
        id: "2",
        name: "Generic Keywords",
        status: "active",
        budget: 8000,
        spend: 7650,
        impressions: 85000,
        clicks: 900,      // Low clicks despite high spend
        conversions: 12,   // Low conversions
        cpc: 8.50,        // VERY HIGH CPC (issue!)
        ctr: 1.06,        // Low CTR
        conversionRate: 1.33  // Conversion rate similar to brand
      },
      {
        id: "3",
        name: "Long-Tail Keywords",
        status: "active",
        budget: 4000,
        spend: 3200,
        impressions: 45000,
        clicks: 2100,
        conversions: 38,
        cpc: 1.52,       // Decent CPC
        ctr: 4.67,       // Great CTR
        conversionRate: 1.81  // Best conversion rate!
      }
    ]
  }
}
```

**Expected Student Discovery:**
1. Total spend: $13,700, Conversions: 95, Overall CPA: $144
2. Brand campaign: CPA = $63 (efficient)
3. Generic keywords: CPA = $638 (terrible!)
4. Long-tail keywords: CPA = $84 (best!)
5. **Conclusion:** Kill generic keywords campaign, reallocate to long-tail

**Advanced Analysis:**
- Generic keywords eating 56% of budget but generating only 13% of conversions
- If reallocate $7,650 from generic → long-tail at same CPA ($84), would get 91 more conversions
- Total conversions could be 170+ instead of 95 (79% improvement!)

---

### 3. Advanced: Multi-Channel Attribution Puzzle

**File:** `SCENARIO_TEMPLATES.advancedMultiChannel`

**Learning Objectives:**
- Cross-channel attribution analysis
- Customer journey mapping
- ROAS optimization across platforms

**Key Issue:** Instagram drives awareness but LinkedIn converts

**Configuration:**
```typescript
{
  name: "Cross-Channel Attribution Puzzle",
  difficulty: "advanced",
  industry: "b2b",

  // Multiple platforms with interconnected data
  gaConfig: {
    // UTM campaign tracking shows multi-touch journeys
    topCampaigns: [
      {
        source: 'instagram',
        medium: 'cpc',
        campaign: 'awareness-Q4',
        sessions: 8500,
        bounceRate: 0.68,  // High bounce
        avgSessionDuration: 45,
        conversions: 5  // Very few direct conversions
      },
      {
        source: 'linkedin',
        medium: 'cpc',
        campaign: 'lead-gen-Q4',
        sessions: 2100,
        bounceRate: 0.35,  // Low bounce
        avgSessionDuration: 240,
        conversions: 85  // Most conversions!
      }
    ]
  },

  metaConfig: {
    campaigns: [
      {
        name: "Instagram Awareness Campaign",
        platform: "instagram",
        objective: "REACH",
        spend: 12000,
        impressions: 2500000,
        reach: 450000,
        clicks: 8500,
        cpc: 1.41,
        conversions: 5,  // Direct conversions low
        conversionValue: 7500
      }
    ]
  },

  linkedInConfig: {
    campaigns: [
      {
        name: "LinkedIn Lead Gen",
        objective: "LEAD_GENERATION",
        spend: 8500,
        impressions: 125000,
        clicks: 2100,
        conversions: 85,  // High conversions
        conversionValue: 127500,
        cpc: 4.05
      }
    ]
  }
}
```

**Expected Student Discovery:**
1. **Surface analysis:** LinkedIn has better ROAS (15x vs 0.6x)
2. **Deeper analysis:** Instagram reaches 450K people, LinkedIn only 30K
3. **Attribution insight:** Many LinkedIn converters first saw Instagram ad
4. **Multi-touch journey:** Awareness (Instagram) → Consideration (Google) → Conversion (LinkedIn)
5. **Conclusion:** Instagram is essential for top-of-funnel; don't cut it!

---

## Data Generation Functions

### Google Analytics Mock Data

```typescript
function generateMockGA4Data(config: GAMockConfig): GoogleAnalyticsMulti {
  const propertyId = `mock-ga-${randomId()}`;

  return {
    properties: [{
      propertyId,
      propertyName: config.websiteName,
      dateRange: config.dateRange || 'Last 30 days',

      metrics: {
        sessions: randomInRange(config.sessionsRange),
        users: randomInRange(config.usersRange),
        pageviews: randomInRange(
          config.sessionsRange[0] * 2.5,
          config.sessionsRange[1] * 3.5
        ),
        bounceRate: addNoise(config.bounceRate, config.noiseLevel),
        engagementRate: 1 - config.bounceRate + randomFloat(-0.1, 0.1),
        avgSessionDuration: randomInRange([60, 240]),
        // ... more metrics
      },

      dimensions: {
        topSources: generateTrafficSources(config.trafficSources),
        devices: generateDeviceBreakdown(config.deviceMix),
        topPages: generateTopPages(config.industry),
        countries: generateGeoData(),
        daily: generateDailyTrend(config.sessionsRange, 30)
      },

      realtime: {
        activeUsers: randomInRange([5, 50])
      }
    }]
  };
}
```

### Randomization Utilities

```typescript
// Add realistic variance to metrics
function addNoise(value: number, noiseLevel: number = 0.1): number {
  const variance = value * noiseLevel;
  return value + randomFloat(-variance, variance);
}

// Generate daily trend with realistic fluctuations
function generateDailyTrend(
  sessionRange: [number, number],
  days: number
): DailyMetric[] {
  const trend: DailyMetric[] = [];
  const baselineSessions = (sessionRange[0] + sessionRange[1]) / 2;

  for (let i = 0; i < days; i++) {
    const dayOfWeek = i % 7;

    // Weekends have lower traffic (-30%)
    const weekendModifier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;

    // Add random daily variance
    const randomModifier = randomFloat(0.85, 1.15);

    const sessions = Math.round(
      (baselineSessions / 30) * weekendModifier * randomModifier
    );

    trend.push({
      date: formatDate(i),
      sessions,
      users: Math.round(sessions * 0.8),
      pageviews: Math.round(sessions * 3.2)
    });
  }

  return trend;
}
```

---

## Scenario Library

### Location
**File:** `/src/lib/platforms/mock/scenarios.ts`

### Pre-Built Templates

```typescript
export const SCENARIO_TEMPLATES = {
  // Beginner scenarios (1-2 issues to find)
  beginnerEcommerce: { /* ... */ },
  beginnerLocalBusiness: { /* ... */ },
  beginnerBlogger: { /* ... */ },

  // Intermediate scenarios (3-4 related issues)
  intermediateAds: { /* ... */ },
  intermediateSaaS: { /* ... */ },
  intermediateNonprofit: { /* ... */ },

  // Advanced scenarios (complex multi-channel)
  advancedMultiChannel: { /* ... */ },
  advancedSeasonality: { /* ... */ },
  advancedAttributionModel: { /* ... */ }
};
```

### Template Selection Logic

```typescript
export function selectScenarioTemplate(
  difficulty?: string,
  industry?: string
): MockScenarioTemplate {
  // Filter by criteria
  const candidates = Object.values(SCENARIO_TEMPLATES).filter(t => {
    if (difficulty && t.difficulty !== difficulty) return false;
    if (industry && t.industry !== industry) return false;
    return true;
  });

  // Random selection from candidates
  return candidates[Math.floor(Math.random() * candidates.length)];
}
```

---

## Database Model

### MockDataScenario Schema

```typescript
interface IMockDataScenario {
  _id: ObjectId;

  // Metadata
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  industry: string;

  // Generated platform data (frozen snapshot)
  platformData: {
    googleAnalyticsMulti?: any;
    googleAds?: any;
    metaAds?: any;
    linkedInAds?: any;
  };

  // Learning components
  learningObjectives: string[];
  keyInsights: string[];
  modelAnswer?: string;  // Hidden from students

  // Instructor tools
  createdBy: ObjectId;   // Instructor who created it
  isPublic: boolean;     // Can other instructors use it?
  usageCount: number;    // How many students have used it

  // Analytics
  avgCompletionTime?: number;  // Minutes
  avgStudentScore?: number;    // 0-100

  timestamps: { createdAt: Date; updatedAt: Date };
}
```

---

## Instructor Scenario Creation (Future)

### Custom Scenario Builder API

**Endpoint:** `POST /api/platforms/mock`

```typescript
export async function POST(req: Request) {
  const user = await requireAuth();

  if (user.accountType !== 'instructor') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { scenarioConfig } = await req.json();

  // Validate config
  validateScenarioConfig(scenarioConfig);

  // Generate mock data
  const platformData = generateMockPlatformData(scenarioConfig);

  // Save to database
  const scenario = await MockDataScenarioModel.create({
    name: scenarioConfig.name,
    description: scenarioConfig.description,
    difficulty: scenarioConfig.difficulty,
    industry: scenarioConfig.industry,
    platformData,
    learningObjectives: scenarioConfig.learningObjectives,
    keyInsights: scenarioConfig.keyInsights,
    createdBy: user.id,
    isPublic: false,
    usageCount: 0
  });

  return Response.json({
    success: true,
    scenarioId: scenario._id
  });
}
```

---

## Testing Mock Data

### Unit Tests

```typescript
describe('Mock Data Generator', () => {
  it('generates valid GA4 data structure', () => {
    const data = generateMockGA4Data(SCENARIO_TEMPLATES.beginnerEcommerce.gaConfig);

    expect(data.properties).toHaveLength(1);
    expect(data.properties[0].metrics.sessions).toBeGreaterThan(0);
    expect(data.properties[0].dimensions.devices).toHaveLength(3);
  });

  it('embeds intended issues in beginner scenario', () => {
    const data = generateMockPlatformData(SCENARIO_TEMPLATES.beginnerEcommerce);
    const ga = data.googleAnalyticsMulti;

    // Find mobile device data
    const mobile = ga.properties[0].dimensions.devices.find(d => d.device === 'mobile');

    // Mobile should have high traffic (70%)
    expect(mobile.percentage).toBeGreaterThan(60);

    // Mobile should have high bounce rate (issue to find)
    expect(mobile.bounceRate).toBeGreaterThan(0.65);
  });
});
```

### Integration Tests

```typescript
describe('Mock Data in Chat Flow', () => {
  it('student with education account gets mock data', async () => {
    const student = await createTestUser({ accountType: 'education' });
    const client = await createTestClient({ userId: student.id, dataSource: 'mock' });

    const response = await sendMessage({
      conversationId: null,
      messages: [{ role: 'user', content: 'Analyze my traffic' }],
      clientId: client.id
    });

    // Should have received mock data
    expect(response.platformData._source).toBe('mock');
    expect(response.platformData.googleAnalyticsMulti).toBeDefined();
  });
});
```

---

## Performance Considerations

### Caching Strategy

1. **Scenario Templates:** Loaded once at startup (static)
2. **Generated Data:** Cache per client for 24 hours
3. **Database Scenarios:** Cache with TTL of 1 hour

```typescript
const mockDataCache = new Map<string, {
  data: PlatformData;
  generatedAt: number;
}>();

export async function fetchMockPlatformData(
  client: ClientDocument
): Promise<PlatformDataResponse> {
  const cacheKey = `mock:${client._id}`;
  const cached = mockDataCache.get(cacheKey);

  // Return cached data if less than 24 hours old
  if (cached && (Date.now() - cached.generatedAt) < 86400000) {
    return { data: cached.data, source: 'mock-cached' };
  }

  // Generate or load from DB
  const data = client.mockScenario
    ? await loadScenarioFromDB(client.mockScenario)
    : generateMockPlatformData(selectScenarioTemplate());

  // Cache for 24 hours
  mockDataCache.set(cacheKey, {
    data,
    generatedAt: Date.now()
  });

  return { data, source: 'mock' };
}
```

---

## Related Files

- [02-HYBRID-MODE-IMPLEMENTATION.md](./02-HYBRID-MODE-IMPLEMENTATION.md) - Main implementation plan
- [04-ACCOUNT-TYPES.md](./04-ACCOUNT-TYPES.md) - Account restrictions
- `/src/lib/platforms/mock/generator.ts` - Generator implementation (TBD)
- `/src/lib/platforms/mock/scenarios.ts` - Scenario templates (TBD)
- `/src/models/MockDataScenario.ts` - Database model (TBD)

---

**Status:** 📝 Specification Complete
**Implementation:** ⏳ Pending Phase 2
