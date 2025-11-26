/**
 * Mock Meta Ads Data for Development
 *
 * Use this when Meta account verification is pending
 */

export const MOCK_META_AD_ACCOUNTS = [
  {
    id: 'act_1234567890',
    account_id: '1234567890',
    name: 'Test Ad Account',
    account_status: 1,
    currency: 'USD',
  },
  {
    id: 'act_0987654321',
    account_id: '0987654321',
    name: 'Demo Business Account',
    account_status: 1,
    currency: 'EUR',
  },
];

export const MOCK_META_INSIGHTS = {
  data: [
    {
      date_start: '2024-11-01',
      date_stop: '2024-11-26',
      account_id: '1234567890',
      impressions: '125430',
      clicks: '3421',
      spend: '1250.50',
      reach: '45230',
      frequency: '2.77',
      ctr: '2.73',
      cpc: '0.37',
      cpm: '9.97',
      conversions: '142',
      cost_per_conversion: '8.81',
    },
  ],
};

export const MOCK_META_CAMPAIGNS = [
  {
    id: 'campaign_123',
    name: 'Black Friday Campaign',
    status: 'ACTIVE',
    objective: 'CONVERSIONS',
    daily_budget: '500',
  },
  {
    id: 'campaign_456',
    name: 'Brand Awareness Q4',
    status: 'ACTIVE',
    objective: 'BRAND_AWARENESS',
    daily_budget: '200',
  },
];

/**
 * Use mock data in development mode
 */
export function useMockData(): boolean {
  return process.env.NODE_ENV === 'development' && !process.env.META_APP_ID;
}