# Design Document

## Overview

This design document outlines the technical approach for enhancing the Metrics Lab tracking system to support comprehensive traffic source detection and implementing a modern tabbed analytics interface. The solution involves modifications to the Event data model, enhancements to the tracking endpoint, creation of new analytics API endpoints, and a complete redesign of the project analytics page with tabbed navigation and data visualizations.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  Client Website │
│  (with script)  │
└────────┬────────┘
         │ POST /track (enhanced data)
         ▼
┌─────────────────────────────────────┐
│         Backend API                 │
│  ┌──────────────────────────────┐  │
│  │  Traffic Source Detector     │  │
│  │  (analyzes URL params,       │  │
│  │   referrer, platform IDs)    │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Enhanced Event Storage      │  │
│  │  (MongoDB with new fields)   │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Analytics API Endpoints     │  │
│  │  - /overview                 │  │
│  │  - /organic                  │  │
│  │  - /campaigns                │  │
│  │  - /referrals                │  │
│  └──────────────────────────────┘  │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │  Analytics         │
         │  Dashboard         │
         │  (Tabbed UI)       │
         └────────────────────┘
```

### Technology Stack

- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB with enhanced indexing
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Charts**: Recharts or Chart.js for data visualization
- **State Management**: React hooks (useState, useEffect)

## Components and Interfaces

### 1. Enhanced Event Data Model

**File**: `models/Event.js`

**New Fields**:
```javascript
{
  // Existing fields
  apiKey: String,
  eventType: String,
  timestamp: Date,
  pageUrl: String,
  
  // Enhanced tracking fields
  trafficSource: {
    type: String, // 'organic', 'paid', 'referral', 'direct', 'social'
    platform: String, // 'google', 'facebook', 'instagram', 'youtube', etc.
    medium: String, // 'cpc', 'organic', 'referral', 'social', 'email', etc.
  },
  
  // Campaign tracking (existing + enhanced)
  gclid: String,
  fbclid: String, // NEW: Facebook Click ID
  ttclid: String, // NEW: TikTok Click ID
  li_fat_id: String, // NEW: LinkedIn First-party Ad Tracking
  
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  utm_term: String,
  utm_content: String,
  
  // Referrer tracking
  referrer: String, // Full referrer URL
  referrerDomain: String, // Extracted domain
  
  // Page interaction (existing)
  clickedUrl: String,
  buttonId: String,
  buttonHref: String,
}
```

**Indexes**:
- `apiKey` (existing)
- `trafficSource.type`
- `trafficSource.platform`
- `referrerDomain`
- `utm_source`
- `timestamp` (for time-based queries)

### 2. Traffic Source Detection Service

**File**: `services/trafficSourceDetector.js` (NEW)

**Purpose**: Analyzes incoming event data and determines traffic source classification.

**Interface**:
```javascript
class TrafficSourceDetector {
  /**
   * Analyzes event data and returns traffic source classification
   * @param {Object} eventData - Raw event data from tracking script
   * @returns {Object} - { type, platform, medium }
   */
  static detectSource(eventData) {
    // Detection logic
  }
  
  /**
   * Extracts domain from referrer URL
   * @param {String} referrerUrl
   * @returns {String} - Domain or null
   */
  static extractDomain(referrerUrl) {
    // Domain extraction logic
  }
  
  /**
   * Identifies search engine from referrer
   * @param {String} domain
   * @returns {String|null} - Search engine name or null
   */
  static identifySearchEngine(domain) {
    // Search engine detection
  }
}
```

**Detection Logic**:

1. **Paid Traffic Detection**:
   - If `gclid` exists → Google Ads (type: 'paid', platform: 'google')
   - If `fbclid` exists → Facebook Ads (type: 'paid', platform: 'facebook')
   - If `ttclid` exists → TikTok Ads (type: 'paid', platform: 'tiktok')
   - If `li_fat_id` exists → LinkedIn Ads (type: 'paid', platform: 'linkedin')
   - If `utm_medium` contains 'cpc', 'ppc', 'paid' → Paid (platform from utm_source)

2. **Organic Traffic Detection**:
   - If referrer domain is a search engine → Organic (platform: search engine name)
   - Search engines: google.com, bing.com, yahoo.com, duckduckgo.com, baidu.com, yandex.ru

3. **Referral Traffic Detection**:
   - If referrer exists and is not a search engine → Referral (platform: referrer domain)

4. **Social Traffic Detection**:
   - If utm_source or referrer matches social platforms → Social
   - Social platforms: facebook, instagram, twitter, linkedin, youtube, tiktok, pinterest

5. **Direct Traffic Detection**:
   - If no referrer and no UTM parameters → Direct

### 3. Enhanced Tracking Endpoint

**File**: `index.js` (modification to `/track` endpoint)

**Changes**:
- Accept new tracking parameters (fbclid, ttclid, li_fat_id, referrer)
- Call TrafficSourceDetector to classify traffic
- Store enhanced event data with traffic source classification

**Request Body Example**:
```javascript
{
  apiKey: "key_abc123",
  event_type: "page_view",
  page_url: "https://example.com/product",
  referrer: "https://google.com/search?q=...",
  
  // Platform-specific IDs
  gclid: "abc123",
  fbclid: "xyz789",
  
  // UTM parameters
  utm_source: "facebook",
  utm_medium: "cpc",
  utm_campaign: "summer_sale",
  utm_term: "shoes",
  utm_content: "ad_variant_a",
  
  // Click tracking
  clicked_url: "https://example.com/checkout",
  button_id: "buy-now-btn",
  button_href: "/checkout"
}
```

### 4. Analytics API Endpoints

**File**: `routes/analyticsRoutes.js` (NEW)

**Endpoints**:

#### GET `/api/projects/:projectId/analytics/overview`
Returns aggregated overview data for the project.

**Response**:
```javascript
{
  totalEvents: 1250,
  dateRange: { start: "2024-01-01", end: "2024-01-31" },
  trafficBreakdown: {
    organic: 450,
    paid: 320,
    referral: 280,
    direct: 150,
    social: 50
  },
  topSources: [
    { platform: "google", type: "organic", count: 380 },
    { platform: "facebook", type: "paid", count: 200 },
    { platform: "instagram", type: "social", count: 150 }
  ],
  dailyTrend: [
    { date: "2024-01-01", count: 45 },
    { date: "2024-01-02", count: 52 }
  ]
}
```

#### GET `/api/projects/:projectId/analytics/organic`
Returns organic traffic data grouped by search engine and landing page.

**Query Parameters**: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Response**:
```javascript
{
  totalOrganic: 450,
  bySearchEngine: [
    { engine: "google", count: 380, percentage: 84.4 },
    { engine: "bing", count: 50, percentage: 11.1 },
    { engine: "yahoo", count: 20, percentage: 4.4 }
  ],
  topLandingPages: [
    { url: "/products", count: 120 },
    { url: "/blog/article-1", count: 85 }
  ],
  trend: [...]
}
```

#### GET `/api/projects/:projectId/analytics/campaigns`
Returns paid campaign data with performance metrics.

**Query Parameters**: `?platform=google&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Response**:
```javascript
{
  totalCampaigns: 15,
  campaigns: [
    {
      name: "summer_sale",
      platform: "facebook",
      medium: "cpc",
      visits: 250,
      clicks: 180,
      uniqueSources: 3,
      lastSeen: "2024-01-31T10:30:00Z"
    }
  ],
  byPlatform: {
    google: 180,
    facebook: 200,
    instagram: 50
  }
}
```

#### GET `/api/projects/:projectId/analytics/referrals`
Returns referral traffic data grouped by domain.

**Response**:
```javascript
{
  totalReferrals: 280,
  topReferrers: [
    {
      domain: "partner-site.com",
      count: 120,
      topUrls: [
        { url: "https://partner-site.com/blog/review", count: 80 }
      ],
      topLandingPages: [
        { url: "/products", count: 60 }
      ]
    }
  ]
}
```

#### GET `/api/projects/:projectId/analytics/direct`
Returns direct traffic data.

**Response**:
```javascript
{
  totalDirect: 150,
  topLandingPages: [
    { url: "/", count: 80 },
    { url: "/products", count: 40 }
  ],
  trend: [...]
}
```

### 5. Analytics Dashboard UI Components

**File**: `dashboard/app/project/[projectId]/page.jsx` (complete redesign)

**Component Structure**:

```
ProjectAnalyticsPage
├── AnalyticsHeader (project name, date range selector)
├── TabNavigation (Overview, Organic, Campaigns, Referrals, Direct)
└── TabContent
    ├── OverviewTab
    │   ├── MetricsCards (total visits, sources, etc.)
    │   ├── TrafficSourceChart (pie/donut chart)
    │   ├── TopSourcesTable
    │   └── TrendChart (line chart)
    ├── OrganicTab
    │   ├── SearchEngineBreakdown
    │   ├── TopLandingPages
    │   └── OrganicTrendChart
    ├── CampaignsTab
    │   ├── PlatformFilter
    │   ├── CampaignsTable (sortable)
    │   └── CampaignDetails (expandable rows)
    ├── ReferralsTab
    │   ├── ReferrersList
    │   └── ReferrerDetails
    └── DirectTab
        ├── DirectTrafficMetrics
        └── LandingPagesTable
```

**Tab Navigation Component**:
```jsx
const tabs = [
  { id: 'overview', label: 'Overview', count: totalEvents },
  { id: 'organic', label: 'Organic', count: organicCount },
  { id: 'campaigns', label: 'Paid Campaigns', count: paidCount },
  { id: 'referrals', label: 'Referrals', count: referralCount },
  { id: 'direct', label: 'Direct', count: directCount }
];

<div className="border-b border-gray-200">
  <nav className="flex space-x-8">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`
          py-4 px-1 border-b-2 font-medium text-sm
          ${activeTab === tab.id 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'}
        `}
      >
        {tab.label}
        <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
          {tab.count}
        </span>
      </button>
    ))}
  </nav>
</div>
```

### 6. Client-Side Tracking Script Enhancement

**File**: `public/tracking-script.js` (NEW) or documentation for users

**Enhanced Script**:
```javascript
(function() {
  const API_KEY = 'YOUR_API_KEY_HERE';
  const TRACKING_ENDPOINT = 'https://your-domain.com/track';
  
  // Extract all URL parameters
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      gclid: params.get('gclid'),
      fbclid: params.get('fbclid'),
      ttclid: params.get('ttclid'),
      li_fat_id: params.get('li_fat_id'),
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content')
    };
  }
  
  // Send tracking event
  function track(eventType, additionalData = {}) {
    const data = {
      apiKey: API_KEY,
      event_type: eventType,
      page_url: window.location.href,
      referrer: document.referrer || null,
      ...getUrlParams(),
      ...additionalData
    };
    
    fetch(TRACKING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(err => console.error('Tracking error:', err));
  }
  
  // Track page view on load
  track('page_view');
  
  // Track button clicks
  document.addEventListener('click', function(e) {
    const button = e.target.closest('a, button');
    if (button) {
      track('click', {
        clicked_url: button.href || null,
        button_id: button.id || null,
        button_href: button.getAttribute('href') || null
      });
    }
  });
})();
```

## Data Models

### Enhanced Event Schema

```javascript
const eventSchema = new mongoose.Schema({
  apiKey: { 
    type: String, 
    required: true, 
    index: true 
  },
  eventType: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  
  // Traffic Source Classification
  trafficSource: {
    type: {
      type: String,
      enum: ['organic', 'paid', 'referral', 'direct', 'social'],
      index: true
    },
    platform: {
      type: String,
      index: true
    },
    medium: String
  },
  
  // Platform-specific tracking IDs
  gclid: { type: String, index: true },
  fbclid: { type: String, index: true },
  ttclid: String,
  li_fat_id: String,
  
  // UTM Parameters
  utm_source: { type: String, index: true },
  utm_medium: String,
  utm_campaign: String,
  utm_term: String,
  utm_content: String,
  
  // Referrer Information
  referrer: String,
  referrerDomain: { type: String, index: true },
  
  // Page Information
  pageUrl: String,
  clickedUrl: String,
  buttonId: String,
  buttonHref: String
});

// Compound indexes for common queries
eventSchema.index({ apiKey: 1, timestamp: -1 });
eventSchema.index({ apiKey: 1, 'trafficSource.type': 1 });
eventSchema.index({ apiKey: 1, 'trafficSource.platform': 1 });
```

## Error Handling

### Backend Error Handling

1. **Invalid API Key**: Return 401 with message
2. **Missing Required Fields**: Return 400 with validation errors
3. **Database Errors**: Log error, return 500, but still accept event (graceful degradation)
4. **Invalid Date Ranges**: Return 400 with helpful message
5. **Unauthorized Project Access**: Return 403 with message

### Frontend Error Handling

1. **API Failures**: Show error message with retry button
2. **No Data**: Show empty state with helpful instructions
3. **Loading States**: Show skeleton loaders for better UX
4. **Network Errors**: Show offline indicator and cache last known data

## Testing Strategy

### Unit Tests

1. **TrafficSourceDetector Service**:
   - Test detection of each traffic source type
   - Test edge cases (missing data, malformed URLs)
   - Test domain extraction logic
   - Test search engine identification

2. **Analytics API Endpoints**:
   - Test data aggregation logic
   - Test date range filtering
   - Test authorization checks
   - Test pagination

### Integration Tests

1. **End-to-End Tracking Flow**:
   - Send tracking event → Verify storage → Verify analytics retrieval
   - Test with various traffic source combinations

2. **Dashboard UI**:
   - Test tab switching
   - Test data loading and display
   - Test filtering and sorting

### Manual Testing Checklist

- [ ] Track organic visit (clean URL)
- [ ] Track Google Ads click (with gclid)
- [ ] Track Facebook Ads click (with fbclid)
- [ ] Track referral from external site
- [ ] Track direct visit (no referrer, no params)
- [ ] Verify all tabs display correct data
- [ ] Test date range filtering
- [ ] Test responsive design on mobile/tablet
- [ ] Test with large dataset (1000+ events)

## Performance Considerations

1. **Database Indexing**: Create indexes on frequently queried fields
2. **Query Optimization**: Use aggregation pipelines for analytics
3. **Pagination**: Limit results to 100-200 events per request
4. **Caching**: Consider Redis for frequently accessed analytics data
5. **Lazy Loading**: Load tab data only when tab is activated
6. **Debouncing**: Debounce date range changes to reduce API calls

## Security Considerations

1. **API Key Validation**: Verify API key exists and is valid
2. **Project Ownership**: Verify user owns project before showing analytics
3. **Rate Limiting**: Implement rate limiting on tracking endpoint
4. **Input Sanitization**: Sanitize all user inputs to prevent XSS
5. **CORS**: Maintain proper CORS configuration

## Migration Strategy

Since this is an enhancement to existing functionality:

1. **Backward Compatibility**: Existing events without new fields will still work
2. **Gradual Rollout**: New tracking script is optional; old events remain visible
3. **Data Backfill**: Optionally analyze existing events to classify traffic sources
4. **UI Fallback**: If no traffic source data, show in "Uncategorized" section

## UI/UX Design Principles

1. **Progressive Disclosure**: Show summary first, details on demand
2. **Visual Hierarchy**: Use size, color, and spacing to guide attention
3. **Consistent Patterns**: Reuse components and interactions across tabs
4. **Responsive Design**: Mobile-first approach with breakpoints
5. **Loading States**: Always show feedback during data fetching
6. **Empty States**: Provide helpful guidance when no data exists
7. **Color Coding**: Use consistent colors for traffic types across all views
