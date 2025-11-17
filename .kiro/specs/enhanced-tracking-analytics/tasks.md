# Implementation Plan

- [x] 1. Enhance Event data model with traffic source fields
  - Update `models/Event.js` to add new fields: trafficSource (type, platform, medium), fbclid, ttclid, li_fat_id, referrer, referrerDomain
  - Add database indexes for trafficSource.type, trafficSource.platform, referrerDomain, fbclid, and timestamp
  - Add compound indexes for common query patterns (apiKey + timestamp, apiKey + trafficSource.type)
  - _Requirements: 1.5, 2.4, 10.1, 10.2_

- [x] 2. Create Traffic Source Detection service





  - [x] 2.1 Create `services/trafficSourceDetector.js` with TrafficSourceDetector class

    - Implement `detectSource(eventData)` method that analyzes event data and returns traffic source classification
    - Implement paid traffic detection logic (gclid → Google, fbclid → Facebook, ttclid → TikTok, li_fat_id → LinkedIn)
    - Implement organic traffic detection by identifying search engines from referrer domains
    - Implement referral traffic detection for non-search-engine referrers
    - Implement social traffic detection from utm_source or referrer matching social platforms
    - Implement direct traffic detection (no referrer, no UTM params)
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_


  - [x] 2.2 Add helper methods to TrafficSourceDetector




    - Implement `extractDomain(referrerUrl)` to extract domain from full referrer URL
    - Implement `identifySearchEngine(domain)` to detect search engines (google, bing, yahoo, duckduckgo, baidu, yandex)
    - Create constants for social platforms list and search engines list
    - _Requirements: 1.2, 7.4_

- [x] 3. Update tracking endpoint to use enhanced detection




  - Modify POST `/track` endpoint in `index.js` to accept new parameters (fbclid, ttclid, li_fat_id, referrer)
  - Import and use TrafficSourceDetector to classify incoming events
  - Extract referrer domain using TrafficSourceDetector helper
  - Store enhanced event data with trafficSource classification in MongoDB
  - Maintain backward compatibility with existing tracking scripts
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 4. Create analytics API routes and endpoints




  - [x] 4.1 Create `routes/analyticsRoutes.js` file and set up Express router with auth middleware


    - Set up router with authentication middleware for all routes
    - Mount router in `index.js` as `/api/projects/:projectId/analytics`
    - _Requirements: 3.2, 4.5_
  - [x] 4.2 Implement GET `/overview` endpoint

    - Verify project ownership using auth middleware
    - Query events with date range filtering (default last 30 days)
    - Aggregate traffic breakdown by trafficSource.type
    - Calculate top sources by platform with counts
    - Generate daily trend data using aggregation pipeline
    - Return JSON response with totalEvents, trafficBreakdown, topSources, dailyTrend
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 4.3 Implement GET `/organic` endpoint

    - Filter events where trafficSource.type = 'organic'
    - Group by trafficSource.platform (search engine) with counts and percentages
    - Aggregate top landing pages (pageUrl) with visit counts
    - Generate organic traffic trend over time
    - Support date range query parameters
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 4.4 Implement GET `/campaigns` endpoint

    - Filter events where trafficSource.type = 'paid'
    - Group by utm_campaign with aggregated metrics (visits, clicks, platform, medium)
    - Support platform filtering via query parameter
    - Calculate byPlatform breakdown
    - Sort campaigns by visit count descending
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 4.5 Implement GET `/referrals` endpoint

    - Filter events where trafficSource.type = 'referral'
    - Group by referrerDomain with counts
    - For each domain, aggregate top referrer URLs and landing pages
    - Sort by visit count descending
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 4.6 Implement GET `/direct` endpoint

    - Filter events where trafficSource.type = 'direct'
    - Aggregate top landing pages with counts
    - Generate direct traffic trend over time
    - _Requirements: 4.1_

- [x] 5. Create reusable UI components for analytics dashboard





  - [x] 5.1 Create `dashboard/components/analytics/MetricsCard.jsx`

    - Display metric title, value, and optional change indicator
    - Use Tailwind CSS for styling with consistent spacing and colors
    - _Requirements: 8.1, 8.5_

  - [x] 5.2 Create `dashboard/components/analytics/TabNavigation.jsx`

    - Render tab buttons with labels and event counts
    - Handle active tab state and onClick events
    - Apply active/inactive styling with blue accent for active tab
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.1_
  - [x] 5.3 Create `dashboard/components/analytics/LoadingState.jsx`


    - Display skeleton loaders for cards, tables, and charts
    - Use consistent loading animation
    - _Requirements: 8.2_
  - [x] 5.4 Create `dashboard/components/analytics/EmptyState.jsx`


    - Show helpful message when no data is available
    - Include icon and call-to-action text
    - _Requirements: 8.3_
  - [x] 5.5 Create `dashboard/components/analytics/DateRangePicker.jsx`


    - Provide preset options (Last 7 days, Last 30 days, Last 90 days)
    - Support custom date range selection
    - Emit onChange event with selected date range
    - _Requirements: 4.5_

- [x] 6. Implement Overview tab component





  - [x] 6.1 Create `dashboard/components/analytics/OverviewTab.jsx`


    - Fetch data from `/api/projects/:projectId/analytics/overview`
    - Display metrics cards for total visits, unique sources, and traffic distribution
    - Render traffic source breakdown using pie or donut chart
    - Display top 5 sources table with platform names and counts
    - Show traffic trend line chart over selected date range
    - Handle loading and error states
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 8.2, 8.3_

  - [x] 6.2 Install and configure charting library (recharts)

    - Add recharts dependency to dashboard/package.json
    - Create reusable chart wrapper components for consistent styling
    - _Requirements: 4.2_

- [x] 7. Implement Organic Traffic tab component




  - Create `dashboard/components/analytics/OrganicTab.jsx`
  - Fetch data from `/api/projects/:projectId/analytics/organic`
  - Display search engine breakdown with percentages using horizontal bar chart
  - Show top landing pages table with URLs and visit counts
  - Render organic traffic trend line chart
  - Handle empty state when no organic traffic exists
  - _Requirements: 7.1, 7.2, 7.3, 8.2, 8.3_

- [x] 8. Implement Paid Campaigns tab component






  - [x] 8.1 Create `dashboard/components/analytics/CampaignsTab.jsx`

    - Fetch data from `/api/projects/:projectId/analytics/campaigns`
    - Display platform filter dropdown (All, Google, Facebook, Instagram, etc.)
    - Render campaigns table with columns: campaign name, platform, medium, visits, clicks
    - Implement sortable columns (click header to sort)
    - Show platform breakdown summary cards
    - Handle loading and empty states
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 8.2, 8.3_

  - [x] 8.2 Add expandable campaign details rows




    - Implement expand/collapse functionality for each campaign row
    - Show detailed event list when expanded with timestamps and page URLs
    - _Requirements: 5.4_

- [x] 9. Implement Referral Traffic tab component





  - Create `dashboard/components/analytics/ReferralsTab.jsx`
  - Fetch data from `/api/projects/:projectId/analytics/referrals`
  - Display referrer domains list with visit counts
  - Implement expandable rows showing top referrer URLs and landing pages for each domain
  - Sort by visit count descending
  - Handle empty state with message about referral traffic
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 8.2, 8.3_

- [x] 10. Implement Direct Traffic tab component





  - Create `dashboard/components/analytics/DirectTab.jsx`
  - Fetch data from `/api/projects/:projectId/analytics/direct`
  - Display total direct visits metric card
  - Show top landing pages table with URLs and counts
  - Render direct traffic trend chart
  - _Requirements: 4.1, 8.2, 8.3_

- [-] 11. Redesign project analytics page with tabbed interface




  - [x] 11.1 Update `dashboard/app/project/[projectId]/page.jsx` with new structure




    - Remove old table-based analytics view
    - Add analytics header with project name and date range picker
    - Implement TabNavigation component with 5 tabs (Overview, Organic, Campaigns, Referrals, Direct)
    - Add state management for active tab and date range
    - Conditionally render tab content based on active tab
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.5, 8.1, 8.4_
  - [x] 11.2 Fetch and display event counts per tab




    - Make API call to get event counts for each traffic type
    - Display counts in tab labels (e.g., "Organic (450)")
    - Update counts when date range changes
    - _Requirements: 3.5_
  - [x] 11.3 Implement responsive layout for mobile and tablet




    - Use Tailwind responsive classes for breakpoints
    - Stack tabs vertically on mobile
    - Adjust chart sizes for smaller screens
    - _Requirements: 8.4_

- [x] 12. Create enhanced tracking script documentation






  - Create `public/tracking-script.js` as example implementation
  - Document how to extract URL parameters (gclid, fbclid, ttclid, li_fat_id, UTM params)
  - Document how to capture document.referrer
  - Document how to send enhanced tracking data to /track endpoint
  - Include examples for page view tracking and click tracking
  - Add installation instructions in project dashboard
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 13. Add error handling and user feedback




  - Implement error boundaries in React components to catch rendering errors
  - Add toast notifications for API errors with retry options
  - Display user-friendly error messages for common issues (network errors, unauthorized access)
  - Add loading spinners and skeleton screens during data fetching
  - Implement graceful degradation when analytics data is unavailable
  - _Requirements: 8.2, 8.3_

- [ ] 14. Optimize database queries and add pagination
  - Add pagination support to analytics endpoints (limit 200 events per request)
  - Implement cursor-based pagination for large datasets
  - Add query result caching for frequently accessed data
  - Optimize aggregation pipelines to use indexes effectively
  - Add query timeout limits to prevent long-running queries
  - _Requirements: 10.3, 10.4, 10.5_

- [ ] 15. Update API configuration for production
  - Ensure CORS settings allow tracking from all domains in production
  - Update NEXT_PUBLIC_API_URL environment variable handling
  - Configure axios interceptors to include auth token in all requests
  - Add request timeout configuration
  - _Requirements: 9.3_
