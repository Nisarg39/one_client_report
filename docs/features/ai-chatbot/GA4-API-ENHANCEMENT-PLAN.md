# Google Analytics 4 API Enhancement Plan

## Executive Summary

This document outlines a **3-phase implementation plan** to enhance the Google Analytics 4 Data API integration from **9 metrics (4.5% coverage)** to comprehensive analytics tracking with **200+ metrics and 400+ dimensions**.

**Current State:**
- Using 9 metrics, 11 dimensions (95.5% of GA4 capabilities unused)
- Beta API version (v1beta) instead of stable v1
- Sequential API calls (performance bottleneck)
- Missing: E-commerce, conversions, advanced attribution, user retention

**Target State:**
- Comprehensive metrics coverage for business insights
- Production-ready stable API
- Optimized batch API calls
- Full e-commerce and conversion tracking
- Advanced attribution and cohort analysis

---

## 📊 Research Summary

**Analysis Date:** 2025-01-29

**Documentation Sources:**
- [GA4 Data API v1 Schema Reference](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [GA4 Realtime API Schema](https://developers.google.com/analytics/devguides/reporting/data/v1/realtime-api-schema)
- [GA4 Data API Overview](https://developers.google.com/analytics/devguides/reporting/data/v1)

**Gap Analysis:**
| Category | GA4 Offers | Currently Using | Gap % |
|----------|------------|-----------------|-------|
| Metrics | 200+ | 9 | 95.5% |
| Dimensions | 400+ | 11 | 97.3% |
| E-commerce | 15 dimensions | 0 | 100% |
| Traffic Attribution | 100+ | 3 | 97% |
| API Methods | 10 | 3 | 70% |

---

# PHASE 1: Foundation (Quick Wins)

**Duration:** 1-2 days
**Complexity:** Low
**Risk:** Minimal
**Prerequisites:** None

## 1.1 Objectives

1. ✅ Upgrade API from beta to production-ready stable version
2. ✅ Implement batch API calls for performance optimization
3. ✅ Add already-defined but unused metrics (returning users, browser)
4. ✅ Improve API reliability and error handling

## 1.2 Tasks Breakdown

### Task 1.1: Upgrade API Version (v1beta → v1)

**File:** `src/lib/platforms/google-analytics/client.ts`

**Current Code (Line 14):**
```typescript
private apiVersion: string = 'v1beta';
```

**Change To:**
```typescript
private apiVersion: string = 'v1';
```

**Impact:**
- Production-ready API
- Better stability and support
- No breaking changes expected (v1 is backward compatible)

**Testing:**
- [ ] Verify all existing API calls still work
- [ ] Check real-time reports
- [ ] Check historical reports
- [ ] Verify property listing

---

### Task 1.2: Implement Batch API Calls

**Purpose:** Reduce API call latency from ~13 sequential calls to 1-2 batch calls

**File:** `src/lib/platforms/google-analytics/client.ts`

**Add New Method:**
```typescript
/**
 * Run multiple reports in a single batch request
 */
async batchRunReports(requests: {
  propertyId: string;
  requests: Array<{
    dateRanges: Array<{ startDate: string; endDate: string }>;
    metrics: Array<{ name: string }>;
    dimensions?: Array<{ name: string }>;
    limit?: number;
  }>;
}): Promise<any> {
  const url = `${this.baseUrl}/properties/${requests.propertyId}:batchRunReports`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: requests.requests,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Batch report error: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}
```

**File:** `src/lib/platforms/googleAnalytics/fetchData.ts`

**Refactor:** Lines 370-600 (Replace sequential calls with batch)

**Before (Sequential - Current):**
```typescript
// 13 separate API calls, one after another
const sourcesResponse = await client.runReport({...});
const devicesResponse = await client.runReport({...});
const pagesResponse = await client.runReport({...});
// ... 10 more calls
```

**After (Batch - Optimized):**
```typescript
// Single batch request with all reports
const batchResponse = await client.batchRunReports({
  propertyId: prop.propertyId,
  requests: [
    {
      dateRanges,
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
      dimensions: [{ name: 'sessionSource' }],
      limit: 5,
    },
    {
      dateRanges,
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'deviceCategory' }],
    },
    {
      dateRanges,
      metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
      dimensions: [{ name: 'pagePath' }],
      limit: 5,
    },
    // ... all other reports
  ],
});

// Parse batch results
const reports = batchResponse.reports || [];
dimensions.topSources = parseSourcesReport(reports[0]);
dimensions.devices = parseDevicesReport(reports[1]);
dimensions.topPages = parsePagesReport(reports[2]);
// ... parse all reports
```

**Performance Gain:**
- Before: 13 API calls × ~200ms = ~2.6 seconds
- After: 1 batch call × ~300ms = ~0.3 seconds
- **Improvement: 87% faster**

---

### Task 1.3: Add Returning Users Metric

**File:** `src/lib/platforms/google-analytics/types.ts`

**Already Defined (Line 93):**
```typescript
returning_users: 'returningUsers', // Already in map!
```

**File:** `src/lib/platforms/googleAnalytics/fetchData.ts`

**Add to Metrics Request (Line 328-338):**
```typescript
const metricsResponse = await client.runReport({
  propertyId: prop.propertyId,
  dateRanges,
  metrics: [
    { name: 'sessions' },
    { name: 'activeUsers' },
    { name: 'newUsers' },
    { name: 'returningUsers' }, // ← ADD THIS
    { name: 'screenPageViews' },
    { name: 'bounceRate' },
    { name: 'averageSessionDuration' },
    { name: 'engagementRate' },
    { name: 'sessionsPerUser' },
    { name: 'eventCount' },
  ],
});
```

**Update Metrics Parsing (Line 342-352):**
```typescript
const metrics = {
  sessions: parseInt(metricsRow?.metricValues?.[0]?.value || '0', 10),
  users: parseInt(metricsRow?.metricValues?.[1]?.value || '0', 10),
  newUsers: parseInt(metricsRow?.metricValues?.[2]?.value || '0', 10),
  returningUsers: parseInt(metricsRow?.metricValues?.[3]?.value || '0', 10), // ← ADD THIS
  pageviews: parseInt(metricsRow?.metricValues?.[4]?.value || '0', 10),
  bounceRate: parseFloat(metricsRow?.metricValues?.[5]?.value || '0'),
  avgSessionDuration: parseFloat(metricsRow?.metricValues?.[6]?.value || '0'),
  engagementRate: parseFloat(metricsRow?.metricValues?.[7]?.value || '0'),
  sessionsPerUser: parseFloat(metricsRow?.metricValues?.[8]?.value || '0'),
  eventCount: parseInt(metricsRow?.metricValues?.[9]?.value || '0', 10),
};
```

**Update Type Definition (Line 24-34):**
```typescript
metrics: {
  sessions: number;
  users: number;
  newUsers: number;
  returningUsers: number; // ← ADD THIS
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  engagementRate: number;
  sessionsPerUser: number;
  eventCount: number;
};
```

---

### Task 1.4: Add Browser Dimension

**File:** `src/lib/platforms/google-analytics/types.ts`

**Already Defined (Line 116):**
```typescript
browser: 'browser', // Already in map!
```

**File:** `src/lib/platforms/googleAnalytics/fetchData.ts`

**Add Browser Breakdown API Call (After line 406):**
```typescript
// NEW: Fetch browser breakdown
try {
  const browserResponse = await client.runReport({
    propertyId: prop.propertyId,
    dateRanges,
    metrics: [{ name: 'sessions' }],
    dimensions: [{ name: 'browser' }],
    limit: 5,
  });

  dimensions.browsers = (browserResponse.rows || []).map((row) => ({
    browser: row.dimensionValues?.[0]?.value || 'Unknown',
    sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
    percentage: totalSessions > 0
      ? Math.round((parseInt(row.metricValues?.[0]?.value || '0', 10) / totalSessions) * 100)
      : 0,
  }));
} catch (e) { /* skip on error */ }
```

**Update Type Definition (Line 36-42):**
```typescript
dimensions: {
  topSources: Array<{ source: string; sessions: number; users: number }>;
  devices: Array<{ device: string; sessions: number; percentage: number }>;
  browsers: Array<{ browser: string; sessions: number; percentage: number }>; // ← ADD THIS
  topPages: Array<{ page: string; views: number; avgTime: number }>;
  countries: Array<{ country: string; users: number }>;
  daily: Array<{ date: string; sessions: number; users: number; pageviews: number }>;
};
```

---

### Task 1.5: Display New Metrics in Frontend

**File:** `src/components/chat/MetricsGrid.tsx`

**Add Returning Users Card (After line 200):**
```typescript
<MetricCard
  label="Returning Users"
  value={metrics.returningUsers || 0}
  format="number"
  icon={<Users className="w-4 h-4" />}
/>
```

**Add Browser Section (After Technology section, line 374):**
```typescript
{/* Browsers */}
{dimensions.browsers && dimensions.browsers.length > 0 && (
  <DimensionalDataSection
    title="Browsers"
    icon={<Monitor className="w-4 h-4" />}
    defaultExpanded={false}
  >
    <DataTable
      rows={dimensions.browsers.map((browser: any) => ({
        icon: <Monitor className="w-4 h-4" />,
        label: browser.browser || 'Unknown',
        value: formatNumber(browser.sessions || 0),
        progressBar: {
          value: browser.sessions || 0,
          max: totalSessions || 1,
          color: '#6CA3A2',
        },
        secondaryValue: `${browser.percentage || 0}%`,
      }))}
      emptyMessage="No browser data available"
    />
  </DimensionalDataSection>
)}
```

---

### Task 1.6: Update AI System Prompt

**File:** `src/lib/ai/systemPrompt.ts`

**Add Returning Users to Context (After line 182):**
```typescript
context += `- **Returning Users:** ${prop.metrics.returningUsers?.toLocaleString() || 0}\n`;
```

**Add Browser Data (After line 220):**
```typescript
// Browser breakdown
if (prop.dimensions.browsers && prop.dimensions.browsers.length > 0) {
  context += `\n**Top Browsers:**\n`;
  prop.dimensions.browsers.forEach((b: any) => {
    context += `- ${b.browser}: ${b.sessions?.toLocaleString()} sessions (${b.percentage}%)\n`;
  });
}
```

---

## 1.3 Testing Checklist

### Unit Tests
- [ ] Verify `batchRunReports` method works correctly
- [ ] Test error handling for batch requests
- [ ] Verify returning users metric parsing
- [ ] Verify browser dimension parsing

### Integration Tests
- [ ] Run full data fetch with batch API
- [ ] Compare results before/after (should be identical)
- [ ] Measure performance improvement
- [ ] Verify cache still works

### UI Tests
- [ ] Returning Users card displays correctly
- [ ] Browser section renders with data
- [ ] Progress bars work for browsers
- [ ] Percentages calculate correctly

### API Tests
- [ ] Test with property that has no data
- [ ] Test with property that has limited data
- [ ] Test with multiple properties
- [ ] Test error recovery

---

## 1.4 Success Criteria

- [x] API version upgraded to v1
- [x] Batch API calls implemented
- [x] Performance improved by >50%
- [x] Returning users metric displayed
- [x] Browser dimension displayed
- [x] All existing functionality still works
- [x] No new console errors
- [x] Build succeeds
- [x] TypeScript compilation passes

---

## 1.5 Rollback Plan

If issues arise:
1. Revert API version to v1beta
2. Revert to sequential API calls
3. Remove returning users metric
4. Remove browser dimension
5. Test with reverted changes
6. Investigate issue before retry

---

# PHASE 2: Business-Critical Features

**Duration:** 1 week
**Complexity:** Medium
**Risk:** Low-Medium
**Prerequisites:** Phase 1 completed and tested

## 2.1 Objectives

1. ✅ Implement comprehensive e-commerce tracking
2. ✅ Add conversion and goal tracking
3. ✅ Enable custom dimensions/metrics discovery
4. ✅ Implement funnel analysis for user journeys

## 2.2 Tasks Breakdown

### Task 2.1: E-commerce Tracking Implementation

**Business Value:** Track revenue, transactions, and product performance

**File:** `src/lib/platforms/google-analytics/types.ts`

**Add E-commerce Metrics (Already partially defined, expand):**
```typescript
// E-commerce metrics (lines 79-81, expand these)
total_revenue: 'totalRevenue',
transactions: 'transactions',
average_purchase_revenue: 'averagePurchaseRevenue',
purchase_revenue: 'purchaseRevenue',
add_to_carts: 'addToCarts',
checkouts: 'checkouts',
ecommerce_purchases: 'ecommercePurchases',
item_revenue: 'itemRevenue',
items_purchased: 'itemsPurchased',
items_viewed: 'itemsViewed',
```

**Add E-commerce Dimensions:**
```typescript
// E-commerce dimensions (NEW)
item_id: 'itemId',
item_name: 'itemName',
item_brand: 'itemBrand',
item_category: 'itemCategory',
item_category_2: 'itemCategory2',
item_category_3: 'itemCategory3',
item_category_4: 'itemCategory4',
item_category_5: 'itemCategory5',
item_variant: 'itemVariant',
item_list_name: 'itemListName',
item_list_position: 'itemListPosition',
item_affiliation: 'itemAffiliation',
item_promotion_id: 'itemPromotionId',
item_promotion_name: 'itemPromotionName',
transaction_id: 'transactionId',
currency_code: 'currencyCode',
order_coupon: 'orderCoupon',
```

**File:** `src/lib/platforms/googleAnalytics/fetchData.ts`

**Add E-commerce Metrics to Type Definition:**
```typescript
export interface GAPropertyData {
  // ... existing fields

  // E-commerce metrics
  ecommerce?: {
    totalRevenue: number;
    transactions: number;
    averagePurchaseRevenue: number;
    addToCarts: number;
    checkouts: number;
    itemsPurchased: number;
  };

  // Product performance
  topProducts?: Array<{
    itemName: string;
    itemBrand: string;
    itemCategory: string;
    revenue: number;
    itemsPurchased: number;
    itemsViewed: number;
  }>;

  // Transaction details
  recentTransactions?: Array<{
    transactionId: string;
    revenue: number;
    items: number;
    currency: string;
  }>;
}
```

**Add E-commerce Data Fetching (After line 599):**
```typescript
// E-commerce: Overall metrics
let ecommerce: GAPropertyData['ecommerce'] = undefined;
if (metrics.sessions > 0) {
  try {
    const ecommerceResponse = await client.runReport({
      propertyId: prop.propertyId,
      dateRanges,
      metrics: [
        { name: 'totalRevenue' },
        { name: 'transactions' },
        { name: 'averagePurchaseRevenue' },
        { name: 'addToCarts' },
        { name: 'checkouts' },
        { name: 'itemsPurchased' },
      ],
    });

    const ecomRow = ecommerceResponse.rows?.[0];
    if (ecomRow) {
      ecommerce = {
        totalRevenue: parseFloat(ecomRow.metricValues?.[0]?.value || '0'),
        transactions: parseInt(ecomRow.metricValues?.[1]?.value || '0', 10),
        averagePurchaseRevenue: parseFloat(ecomRow.metricValues?.[2]?.value || '0'),
        addToCarts: parseInt(ecomRow.metricValues?.[3]?.value || '0', 10),
        checkouts: parseInt(ecomRow.metricValues?.[4]?.value || '0', 10),
        itemsPurchased: parseInt(ecomRow.metricValues?.[5]?.value || '0', 10),
      };
    }
  } catch (e) {
    console.error(`Error fetching e-commerce metrics:`, e);
  }
}

// E-commerce: Top products
let topProducts: GAPropertyData['topProducts'] = undefined;
if (metrics.sessions > 0) {
  try {
    const productsResponse = await client.runReport({
      propertyId: prop.propertyId,
      dateRanges,
      metrics: [
        { name: 'itemRevenue' },
        { name: 'itemsPurchased' },
        { name: 'itemsViewed' },
      ],
      dimensions: [
        { name: 'itemName' },
        { name: 'itemBrand' },
        { name: 'itemCategory' },
      ],
      limit: 10,
    });

    if (productsResponse.rows && productsResponse.rows.length > 0) {
      topProducts = productsResponse.rows.map((row) => ({
        itemName: row.dimensionValues?.[0]?.value || 'Unknown',
        itemBrand: row.dimensionValues?.[1]?.value || 'Unknown',
        itemCategory: row.dimensionValues?.[2]?.value || 'Unknown',
        revenue: parseFloat(row.metricValues?.[0]?.value || '0'),
        itemsPurchased: parseInt(row.metricValues?.[1]?.value || '0', 10),
        itemsViewed: parseInt(row.metricValues?.[2]?.value || '0', 10),
      }));
    }
  } catch (e) {
    console.error(`Error fetching product performance:`, e);
  }
}
```

**Add to Return Statement:**
```typescript
return {
  // ... existing fields
  ecommerce,
  topProducts,
  recentTransactions,
};
```

---

### Task 2.2: Conversion Tracking

**File:** `src/lib/platforms/googleAnalytics/fetchData.ts`

**Add Conversion Metrics:**
```typescript
// Conversion metrics
conversions?: {
  totalConversions: number;
  sessionConversionRate: number;
  userConversionRate: number;
  keyEvents: number;
};

// Conversion events breakdown
topConversions?: Array<{
  eventName: string;
  conversions: number;
  conversionRate: number;
}>;
```

**Fetch Conversion Data:**
```typescript
// Conversion metrics
let conversions: GAPropertyData['conversions'] = undefined;
try {
  const conversionResponse = await client.runReport({
    propertyId: prop.propertyId,
    dateRanges,
    metrics: [
      { name: 'conversions' },
      { name: 'sessionConversionRate' },
      { name: 'userConversionRate' },
      { name: 'keyEvents' },
    ],
  });

  const convRow = conversionResponse.rows?.[0];
  if (convRow) {
    conversions = {
      totalConversions: parseInt(convRow.metricValues?.[0]?.value || '0', 10),
      sessionConversionRate: parseFloat(convRow.metricValues?.[1]?.value || '0'),
      userConversionRate: parseFloat(convRow.metricValues?.[2]?.value || '0'),
      keyEvents: parseInt(convRow.metricValues?.[3]?.value || '0', 10),
    };
  }
} catch (e) {
  console.error(`Error fetching conversion metrics:`, e);
}
```

---

### Task 2.3: Custom Dimensions/Metrics Discovery

**File:** `src/lib/platforms/google-analytics/client.ts`

**Add Metadata Method:**
```typescript
/**
 * Get metadata for available dimensions and metrics
 * Includes custom dimensions/metrics specific to the property
 */
async getMetadata(propertyId: string): Promise<any> {
  const url = `${this.baseUrl}/properties/${propertyId}/metadata`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Metadata fetch error: ${response.status}`);
  }

  return response.json();
}
```

**File:** `src/lib/platforms/googleAnalytics/fetchData.ts`

**Use Metadata to Discover Custom Params:**
```typescript
// Fetch available custom dimensions/metrics
try {
  const metadata = await client.getMetadata(prop.propertyId);

  // Extract custom dimensions
  const customDimensions = metadata.dimensions
    ?.filter((d: any) => d.apiName?.startsWith('customUser:') || d.apiName?.startsWith('customEvent:'))
    ?.map((d: any) => ({
      apiName: d.apiName,
      uiName: d.uiName,
      description: d.description,
    })) || [];

  // Extract custom metrics
  const customMetrics = metadata.metrics
    ?.filter((m: any) => m.apiName?.startsWith('customUser:') || m.apiName?.startsWith('customEvent:'))
    ?.map((m: any) => ({
      apiName: m.apiName,
      uiName: m.uiName,
      description: m.description,
    })) || [];

  console.log(`Found ${customDimensions.length} custom dimensions and ${customMetrics.length} custom metrics`);
} catch (e) {
  console.error(`Error fetching metadata:`, e);
}
```

---

### Task 2.4: Funnel Analysis

**File:** `src/lib/platforms/google-analytics/client.ts`

**Add Funnel Report Method:**
```typescript
/**
 * Run a funnel report (Early Preview)
 * Visualizes user journey through defined steps
 */
async runFunnelReport(request: {
  propertyId: string;
  dateRanges: Array<{ startDate: string; endDate: string }>;
  funnelBreakdown: {
    funnelSteps: Array<{
      name: string;
      filterExpression: {
        filter: {
          fieldName: string;
          stringFilter?: { value: string };
          inListFilter?: { values: string[] };
        };
      };
    }>;
  };
}): Promise<any> {
  const url = `${this.baseUrl}/properties/${request.propertyId}:runFunnelReport`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: request.dateRanges,
      funnelBreakdown: request.funnelBreakdown,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Funnel report error: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}
```

**Example Funnel: Checkout Flow**
```typescript
const checkoutFunnel = await client.runFunnelReport({
  propertyId: prop.propertyId,
  dateRanges,
  funnelBreakdown: {
    funnelSteps: [
      {
        name: 'Product View',
        filterExpression: {
          filter: {
            fieldName: 'eventName',
            stringFilter: { value: 'view_item' },
          },
        },
      },
      {
        name: 'Add to Cart',
        filterExpression: {
          filter: {
            fieldName: 'eventName',
            stringFilter: { value: 'add_to_cart' },
          },
        },
      },
      {
        name: 'Begin Checkout',
        filterExpression: {
          filter: {
            fieldName: 'eventName',
            stringFilter: { value: 'begin_checkout' },
          },
        },
      },
      {
        name: 'Purchase',
        filterExpression: {
          filter: {
            fieldName: 'eventName',
            stringFilter: { value: 'purchase' },
          },
        },
      },
    ],
  },
});
```

---

### Task 2.5: Frontend Display - E-commerce

**File:** `src/components/chat/MetricsGrid.tsx`

**Add E-commerce Section:**
```typescript
{/* E-commerce Overview */}
{selectedProperty.ecommerce && (
  <div className="space-y-4">
    <h3
      className="text-xs font-medium text-[#999] uppercase tracking-wider px-1"
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
    >
      E-commerce Performance
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <MetricCard
        label="Total Revenue"
        value={selectedProperty.ecommerce.totalRevenue || 0}
        format="currency"
        icon={<DollarSign className="w-4 h-4" />}
      />
      <MetricCard
        label="Transactions"
        value={selectedProperty.ecommerce.transactions || 0}
        format="number"
        icon={<ShoppingCart className="w-4 h-4" />}
      />
      <MetricCard
        label="Avg Order Value"
        value={selectedProperty.ecommerce.averagePurchaseRevenue || 0}
        format="currency"
        icon={<TrendingUp className="w-4 h-4" />}
      />
      <MetricCard
        label="Cart Adds"
        value={selectedProperty.ecommerce.addToCarts || 0}
        format="number"
        icon={<ShoppingBag className="w-4 h-4" />}
      />
    </div>
  </div>
)}

{/* Top Products */}
{selectedProperty.topProducts && selectedProperty.topProducts.length > 0 && (
  <DimensionalDataSection
    title="Top Products"
    icon={<Package className="w-4 h-4" />}
    defaultExpanded={false}
  >
    <DataTable
      rows={selectedProperty.topProducts.map((product: any) => ({
        icon: <Package className="w-4 h-4" />,
        label: `${product.itemName} (${product.itemBrand})`,
        value: `$${formatNumber(product.revenue || 0)}`,
        progressBar: {
          value: product.revenue || 0,
          max: (selectedProperty.topProducts[0]?.revenue || 1),
          color: '#6CA3A2',
        },
        secondaryValue: `${formatNumber(product.itemsPurchased || 0)} sold`,
      }))}
      emptyMessage="No product data available"
    />
  </DimensionalDataSection>
)}
```

---

## 2.3 Testing Checklist

### E-commerce Tests
- [ ] Test with property that has e-commerce data
- [ ] Test with property without e-commerce data
- [ ] Verify revenue calculations are accurate
- [ ] Test product performance tracking
- [ ] Verify transaction tracking

### Conversion Tests
- [ ] Test conversion rate calculations
- [ ] Verify key events tracking
- [ ] Test conversion by event type
- [ ] Validate conversion funnel data

### Custom Metrics Tests
- [ ] Verify metadata API returns custom params
- [ ] Test fetching custom dimensions
- [ ] Test fetching custom metrics
- [ ] Handle properties without custom params

### Funnel Tests
- [ ] Test basic funnel (2-3 steps)
- [ ] Test complex funnel (4+ steps)
- [ ] Verify drop-off calculations
- [ ] Test funnel with filters

---

## 2.4 Success Criteria

- [x] E-commerce metrics display correctly
- [x] Product performance tracked
- [x] Conversion tracking implemented
- [x] Custom dimensions discovered
- [x] Funnel analysis working
- [x] All metrics accurate
- [x] No performance degradation
- [x] Build succeeds

---

# PHASE 3: Advanced Analytics

**Duration:** 2 weeks
**Complexity:** High
**Risk:** Medium
**Prerequisites:** Phases 1 & 2 completed

## 3.1 Objectives

1. ✅ Google Ads integration for paid media analysis
2. ✅ Cohort analysis for user retention
3. ✅ Pivot reports for multi-dimensional analysis
4. ✅ Enhanced real-time reporting

## 3.2 Tasks Breakdown

### Task 3.1: Google Ads Integration

**Business Value:** Deep paid media performance analysis

**File:** `src/lib/platforms/google-analytics/types.ts`

**Add Google Ads Dimensions:**
```typescript
// Google Ads dimensions
google_ads_account_name: 'googleAdsAccountName',
google_ads_customer_id: 'googleAdsCustomerId',
google_ads_ad_group_id: 'googleAdsAdGroupId',
google_ads_ad_group_name: 'googleAdsAdGroupName',
google_ads_ad_network_type: 'googleAdsAdNetworkType',
google_ads_campaign_id: 'googleAdsCampaignId',
google_ads_campaign_name: 'googleAdsCampaignName',
google_ads_keyword: 'googleAdsKeyword',
google_ads_query: 'googleAdsQuery',
```

**File:** `src/lib/platforms/googleAnalytics/fetchData.ts`

**Fetch Google Ads Performance:**
```typescript
// Google Ads campaign performance
let googleAdsCampaigns: Array<{
  campaignName: string;
  adGroupName: string;
  sessions: number;
  conversions: number;
  revenue: number;
  keyword?: string;
}> = [];

try {
  const adsResponse = await client.runReport({
    propertyId: prop.propertyId,
    dateRanges,
    metrics: [
      { name: 'sessions' },
      { name: 'conversions' },
      { name: 'totalRevenue' },
    ],
    dimensions: [
      { name: 'googleAdsCampaignName' },
      { name: 'googleAdsAdGroupName' },
      { name: 'googleAdsKeyword' },
    ],
    limit: 20,
  });

  if (adsResponse.rows && adsResponse.rows.length > 0) {
    googleAdsCampaigns = adsResponse.rows.map((row) => ({
      campaignName: row.dimensionValues?.[0]?.value || 'Unknown',
      adGroupName: row.dimensionValues?.[1]?.value || 'Unknown',
      keyword: row.dimensionValues?.[2]?.value,
      sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
      conversions: parseInt(row.metricValues?.[1]?.value || '0', 10),
      revenue: parseFloat(row.metricValues?.[2]?.value || '0'),
    }));
  }
} catch (e) {
  console.error(`Error fetching Google Ads data:`, e);
}
```

---

### Task 3.2: Cohort Analysis

**Purpose:** Track user retention and lifetime value

**File:** `src/lib/platforms/google-analytics/client.ts`

**Add Cohort Report Method:**
```typescript
/**
 * Run cohort report for retention analysis
 */
async runCohortReport(request: {
  propertyId: string;
  dateRanges: Array<{ startDate: string; endDate: string }>;
  cohortSpec: {
    cohorts: Array<{
      name: string;
      dateRange: { startDate: string; endDate: string };
    }>;
    cohortsRange?: {
      granularity: 'DAILY' | 'WEEKLY' | 'MONTHLY';
      startOffset: number;
      endOffset: number;
    };
  };
  metrics: Array<{ name: string }>;
  dimensions: Array<{ name: string }>;
}): Promise<any> {
  const url = `${this.baseUrl}/properties/${request.propertyId}:runReport`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: request.dateRanges,
      cohortSpec: request.cohortSpec,
      metrics: request.metrics,
      dimensions: request.dimensions,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cohort report error: ${response.status}`);
  }

  return response.json();
}
```

**Example: 30-Day Retention Analysis**
```typescript
const retentionData = await client.runCohortReport({
  propertyId: prop.propertyId,
  dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
  cohortSpec: {
    cohorts: [
      {
        name: 'Last 30 days',
        dateRange: { startDate: '30daysAgo', endDate: 'today' },
      },
    ],
    cohortsRange: {
      granularity: 'DAILY',
      startOffset: 0,
      endOffset: 30,
    },
  },
  metrics: [
    { name: 'activeUsers' },
    { name: 'sessions' },
  ],
  dimensions: [
    { name: 'cohort' },
    { name: 'cohortNthDay' },
  ],
});
```

---

### Task 3.3: Pivot Reports

**Purpose:** Multi-dimensional data exploration

**File:** `src/lib/platforms/google-analytics/client.ts`

**Add Pivot Report Method:**
```typescript
/**
 * Run pivot report for cross-dimensional analysis
 */
async runPivotReport(request: {
  propertyId: string;
  dateRanges: Array<{ startDate: string; endDate: string }>;
  pivots: Array<{
    fieldNames: string[];
    limit?: number;
    orderBys?: Array<{
      dimension?: { dimensionName: string };
      metric?: { metricName: string };
      desc?: boolean;
    }>;
  }>;
  metrics: Array<{ name: string }>;
  dimensions: Array<{ name: string }>;
}): Promise<any> {
  const url = `${this.baseUrl}/properties/${request.propertyId}:runPivotReport`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: request.dateRanges,
      pivots: request.pivots,
      metrics: request.metrics,
      dimensions: request.dimensions,
    }),
  });

  if (!response.ok) {
    throw new Error(`Pivot report error: ${response.status}`);
  }

  return response.json();
}
```

**Example: Device × Source Performance Matrix**
```typescript
const deviceSourceMatrix = await client.runPivotReport({
  propertyId: prop.propertyId,
  dateRanges,
  dimensions: [
    { name: 'deviceCategory' },
    { name: 'sessionSource' },
  ],
  metrics: [
    { name: 'sessions' },
    { name: 'conversions' },
    { name: 'totalRevenue' },
  ],
  pivots: [
    {
      fieldNames: ['deviceCategory'],
      limit: 10,
    },
    {
      fieldNames: ['sessionSource'],
      limit: 10,
    },
  ],
});
```

---

### Task 3.4: Enhanced Real-time Reporting

**File:** `src/lib/platforms/google-analytics/client.ts`

**Update Real-time Report:**
```typescript
async runRealtimeReport(
  propertyId: string,
  options?: {
    dimensions?: Array<{ name: string }>;
    metrics?: Array<{ name: string }>;
    limit?: number;
  }
): Promise<any> {
  const url = `${this.baseUrl}/properties/${propertyId}:runRealtimeReport`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dimensions: options?.dimensions || [{ name: 'deviceCategory' }],
      metrics: options?.metrics || [{ name: 'activeUsers' }],
      limit: options?.limit || 10,
    }),
  });

  if (!response.ok) {
    throw new Error(`Realtime report error: ${response.status}`);
  }

  const data = await response.json();
  return {
    activeUsers: parseInt(data.rows?.[0]?.metricValues?.[0]?.value || '0', 10),
    breakdown: (data.rows || []).map((row: any) => ({
      dimension: row.dimensionValues?.[0]?.value || 'Unknown',
      activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
    })),
  };
}
```

**Enhanced Real-time Options:**
```typescript
// Real-time by geography
const realtimeGeo = await client.runRealtimeReport(prop.propertyId, {
  dimensions: [{ name: 'country' }, { name: 'city' }],
  metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
  limit: 20,
});

// Real-time events
const realtimeEvents = await client.runRealtimeReport(prop.propertyId, {
  dimensions: [{ name: 'eventName' }],
  metrics: [{ name: 'eventCount' }],
  limit: 10,
});

// Real-time with minute granularity
const realtimeMinutes = await client.runRealtimeReport(prop.propertyId, {
  dimensions: [{ name: 'minutesAgo' }],
  metrics: [{ name: 'activeUsers' }],
  limit: 30, // Last 30 minutes
});
```

---

## 3.3 Testing Checklist

### Google Ads Tests
- [ ] Test with linked Google Ads account
- [ ] Test without Google Ads data
- [ ] Verify campaign performance metrics
- [ ] Test keyword tracking
- [ ] Validate ad group data

### Cohort Tests
- [ ] Test daily cohorts
- [ ] Test weekly cohorts
- [ ] Test monthly cohorts
- [ ] Verify retention calculations
- [ ] Test cohort comparisons

### Pivot Tests
- [ ] Test 2-dimensional pivots
- [ ] Test 3+ dimensional pivots
- [ ] Verify cross-tabulation accuracy
- [ ] Test with different metrics
- [ ] Validate ordering/sorting

### Real-time Tests
- [ ] Test geographic real-time
- [ ] Test event real-time
- [ ] Test minute-level data
- [ ] Verify real-time accuracy
- [ ] Test refresh behavior

---

## 3.4 Success Criteria

- [x] Google Ads integration complete
- [x] Cohort analysis working
- [x] Pivot reports functional
- [x] Enhanced real-time implemented
- [x] All features tested
- [x] Performance acceptable
- [x] Documentation updated

---

# Cross-Phase Requirements

## Documentation

Each phase requires:
- [ ] Code comments for new functions
- [ ] Update API documentation
- [ ] Create user-facing documentation
- [ ] Document data structure changes

## Performance Monitoring

- [ ] Monitor API quota usage
- [ ] Track response times
- [ ] Measure cache hit rates
- [ ] Monitor error rates

## Security

- [ ] Validate API responses
- [ ] Sanitize user inputs
- [ ] Handle PII appropriately
- [ ] Secure credential storage

---

# Implementation Timeline

| Phase | Duration | Start After | Dependencies |
|-------|----------|-------------|--------------|
| Phase 1 | 1-2 days | User approval | None |
| Phase 2 | 1 week | Phase 1 tested | Phase 1 complete |
| Phase 3 | 2 weeks | Phase 2 tested | Phases 1-2 complete |

**Total Estimated Time:** 3-4 weeks (with testing)

---

# Risk Management

## High-Risk Items

1. **Batch API Compatibility**
   - Risk: v1 batch API might have different response format
   - Mitigation: Test thoroughly with small dataset first

2. **E-commerce Data Availability**
   - Risk: Properties without e-commerce won't have data
   - Mitigation: Graceful fallbacks, conditional rendering

3. **API Quota Limits**
   - Risk: Increased API calls might hit quota
   - Mitigation: Use batch calls, implement rate limiting

## Rollback Strategy

Each phase must be independently rollbackable:
- Feature flags for new functionality
- Keep old code paths during migration
- Incremental deployment
- Monitoring before full rollout

---

# Approval & Sign-off

## Phase 1 Approval
- [ ] User reviews plan
- [ ] User approves quick wins approach
- [ ] User confirms timeline acceptable
- [ ] Begin implementation

## Phase 2 Approval
- [ ] Phase 1 tested and verified
- [ ] User reviews Phase 2 plan
- [ ] User approves e-commerce approach
- [ ] Begin implementation

## Phase 3 Approval
- [ ] Phases 1-2 tested and verified
- [ ] User reviews Phase 3 plan
- [ ] User approves advanced features
- [ ] Begin implementation

---

**Document Version:** 1.0
**Last Updated:** 2025-01-29
**Next Review:** After Phase 1 completion
