# Metrics Lab Enhanced Tracking Script - Installation Guide

## Overview

The Metrics Lab Enhanced Tracking Script provides comprehensive traffic source detection and event tracking for your website. It automatically captures:

- **Organic Traffic**: Visits from search engines (Google, Bing, Yahoo, DuckDuckGo, etc.)
- **Paid Campaigns**: Google Ads, Facebook Ads, Instagram Ads, TikTok Ads, LinkedIn Ads
- **Referral Traffic**: Visits from external websites
- **Direct Traffic**: Direct URL entry or bookmarks
- **Social Traffic**: Visits from social media platforms
- **UTM Parameters**: Full campaign tracking with utm_source, utm_medium, utm_campaign, etc.

## Quick Start

### Step 1: Get Your API Key

1. Log in to your Metrics Lab dashboard
2. Navigate to your project settings
3. Copy your API key (it looks like: `key_abc123xyz...`)

### Step 2: Download the Tracking Script

Download the tracking script from your project dashboard or copy it from:
```
https://your-metrics-lab-domain.com/tracking-script.js
```

### Step 3: Configure the Script

Open `tracking-script.js` and update the configuration:

```javascript
// Replace with your actual API key
const API_KEY = 'your_api_key_here';

// Update with your Metrics Lab backend URL
const TRACKING_ENDPOINT = 'https://your-metrics-lab-domain.com/track';

// Enable debug mode during testing (set to false in production)
const DEBUG_MODE = false;
```

### Step 4: Add to Your Website

Add the script to your HTML before the closing `</body>` tag:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- Metrics Lab Tracking Script -->
    <script src="/tracking-script.js"></script>
</body>
</html>
```

### Step 5: Verify Installation

1. Open your website in a browser
2. Open the browser console (F12)
3. Look for the message: `[Metrics Lab] Metrics Lab tracking initialized`
4. Navigate to your Metrics Lab dashboard to see tracked events

## Installation Methods

### Method 1: Self-Hosted Script

Host the script on your own server:

```html
<script src="/js/tracking-script.js"></script>
```

**Pros**: Full control, no external dependencies
**Cons**: Need to update manually for new features

### Method 2: CDN Hosted

Host the script on a CDN for better performance:

```html
<script src="https://cdn.yoursite.com/tracking-script.js"></script>
```

**Pros**: Fast loading, cached across sites
**Cons**: Requires CDN setup

### Method 3: Inline Script

Embed the script directly in your HTML:

```html
<script>
(function() {
  const API_KEY = 'your_api_key_here';
  const TRACKING_ENDPOINT = 'https://your-domain.com/track';
  // ... rest of the script
})();
</script>
```

**Pros**: No external file dependency
**Cons**: Larger HTML file, harder to update

## Framework Integration

### React / Next.js

Create a tracking component:

```javascript
// components/MetricsLabTracking.jsx
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function MetricsLabTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view on route change
    if (window.MetricsLab) {
      window.MetricsLab.trackPageView();
    }
  }, [pathname, searchParams]);

  return null;
}
```

Add to your layout:

```javascript
// app/layout.jsx
import MetricsLabTracking from '@/components/MetricsLabTracking';
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script src="/tracking-script.js" strategy="afterInteractive" />
        <MetricsLabTracking />
      </body>
    </html>
  );
}
```

### Vue.js

Add to your main App component:

```javascript
// App.vue
<template>
  <router-view />
</template>

<script>
export default {
  watch: {
    $route() {
      // Track page view on route change
      if (window.MetricsLab) {
        window.MetricsLab.trackPageView();
      }
    }
  },
  mounted() {
    // Load tracking script
    const script = document.createElement('script');
    script.src = '/tracking-script.js';
    document.body.appendChild(script);
  }
}
</script>
```

### WordPress

Add to your theme's `footer.php` before `</body>`:

```php
<!-- Metrics Lab Tracking -->
<script src="<?php echo get_template_directory_uri(); ?>/js/tracking-script.js"></script>
```

Or use a plugin like "Insert Headers and Footers" to add the script.

### Shopify

1. Go to Online Store > Themes > Actions > Edit code
2. Open `theme.liquid`
3. Add before `</body>`:

```liquid
<!-- Metrics Lab Tracking -->
<script src="{{ 'tracking-script.js' | asset_url }}"></script>
```

## Traffic Source Detection

The script automatically detects traffic sources based on URL parameters and referrer information:

### Paid Campaign Tracking

The script automatically detects these platform-specific parameters:

| Platform | Parameter | Example URL |
|----------|-----------|-------------|
| Google Ads | `gclid` | `?gclid=abc123&utm_source=google&utm_medium=cpc` |
| Facebook Ads | `fbclid` | `?fbclid=xyz789&utm_source=facebook&utm_medium=cpc` |
| TikTok Ads | `ttclid` | `?ttclid=def456&utm_source=tiktok&utm_medium=cpc` |
| LinkedIn Ads | `li_fat_id` | `?li_fat_id=ghi789&utm_source=linkedin&utm_medium=cpc` |

### UTM Parameters

Standard UTM parameters are automatically captured:

```
https://yoursite.com/?utm_source=newsletter&utm_medium=email&utm_campaign=summer_sale&utm_term=shoes&utm_content=variant_a
```

- `utm_source`: Campaign source (e.g., google, facebook, newsletter)
- `utm_medium`: Campaign medium (e.g., cpc, email, social)
- `utm_campaign`: Campaign name (e.g., summer_sale)
- `utm_term`: Campaign term (e.g., keywords for paid search)
- `utm_content`: Campaign content (e.g., for A/B testing)

### Organic Traffic

Automatically detected when visitors come from search engines:

- Google: `google.com`, `google.co.uk`, etc.
- Bing: `bing.com`
- Yahoo: `yahoo.com`
- DuckDuckGo: `duckduckgo.com`
- Baidu: `baidu.com`
- Yandex: `yandex.ru`

### Referral Traffic

Automatically detected when visitors come from external websites (non-search engines).

### Direct Traffic

Automatically detected when visitors type your URL directly or use bookmarks (no referrer, no parameters).

## Custom Event Tracking

Track custom events beyond page views and clicks:

### Form Submissions

```javascript
document.querySelector('#contact-form').addEventListener('submit', function(e) {
  window.MetricsLab.track('form_submit', {
    form_id: 'contact-form',
    form_name: 'Contact Us',
    form_fields: ['name', 'email', 'message']
  });
});
```

### Video Interactions

```javascript
document.querySelector('#video').addEventListener('play', function() {
  window.MetricsLab.track('video_play', {
    video_id: 'intro-video',
    video_title: 'Product Introduction',
    video_duration: 120
  });
});
```

### E-commerce Events

```javascript
// Add to cart
window.MetricsLab.track('add_to_cart', {
  product_id: '12345',
  product_name: 'Premium Plan',
  price: 99.99,
  currency: 'USD',
  quantity: 1
});

// Purchase
window.MetricsLab.track('purchase', {
  order_id: 'ORD-12345',
  total_amount: 299.97,
  currency: 'USD',
  items_count: 3
});
```

### File Downloads

```javascript
document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
  link.addEventListener('click', function(e) {
    window.MetricsLab.track('file_download', {
      file_name: this.getAttribute('href'),
      file_type: 'pdf'
    });
  });
});
```

## Testing Your Installation

### 1. Enable Debug Mode

Set `DEBUG_MODE = true` in the tracking script to see console logs:

```javascript
const DEBUG_MODE = true;
```

### 2. Test Different Traffic Sources

Visit your website with different URL parameters:

**Google Ads:**
```
https://yoursite.com/?gclid=test123&utm_source=google&utm_medium=cpc&utm_campaign=test
```

**Facebook Ads:**
```
https://yoursite.com/?fbclid=test456&utm_source=facebook&utm_medium=cpc&utm_campaign=test
```

**Email Campaign:**
```
https://yoursite.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly
```

**Organic (simulate):**
Open your site from a Google search or set the referrer manually in browser dev tools.

**Direct:**
```
https://yoursite.com/
```

### 3. Check the Dashboard

1. Go to your Metrics Lab dashboard
2. Select your project
3. Navigate to the Analytics tab
4. Verify events are appearing in the correct traffic source categories

### 4. Verify Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "track"
4. Click around your site
5. Verify POST requests to `/track` endpoint with correct data

## Troubleshooting

### Events Not Appearing in Dashboard

**Check API Key:**
- Verify the API key is correct
- Check for typos or extra spaces
- Ensure the API key is active in your project settings

**Check Endpoint URL:**
- Verify the TRACKING_ENDPOINT matches your backend URL
- Check for HTTPS vs HTTP
- Ensure no trailing slash issues

**Check CORS:**
- Verify your backend allows requests from your website domain
- Check browser console for CORS errors

**Check Network:**
- Open DevTools Network tab
- Look for failed requests to `/track`
- Check response status codes

### Script Not Loading

**Check File Path:**
- Verify the script path is correct
- Check if file exists at the specified location
- Try accessing the script URL directly in browser

**Check Console Errors:**
- Open browser console (F12)
- Look for JavaScript errors
- Fix any syntax errors in the script

### Duplicate Events

**Multiple Script Instances:**
- Ensure the script is only included once
- Check for duplicate script tags
- Verify SPA route tracking isn't duplicating page views

**Event Bubbling:**
- Click events may fire multiple times due to event bubbling
- The script uses event delegation to minimize this

### Traffic Source Not Detected

**Missing Parameters:**
- Verify URL parameters are present
- Check if parameters are being stripped by redirects
- Ensure parameters are properly formatted

**Referrer Not Captured:**
- Some browsers block referrer for privacy
- HTTPS to HTTP transitions may lose referrer
- Check if referrer policy is set correctly

## Privacy & Compliance

### GDPR Compliance

The tracking script collects:
- Page URLs
- Referrer URLs
- UTM parameters
- Click interactions
- Custom event data

**No personal data is collected by default** (no names, emails, IP addresses).

To comply with GDPR:
1. Add a cookie consent banner
2. Only load the tracking script after user consent
3. Provide opt-out mechanism
4. Include tracking in your privacy policy

Example consent implementation:

```javascript
// Only load tracking after consent
if (userHasConsented()) {
  const script = document.createElement('script');
  script.src = '/tracking-script.js';
  document.body.appendChild(script);
}
```

### Data Retention

Configure data retention in your Metrics Lab project settings:
- 30 days (default)
- 90 days
- 1 year
- Custom period

## Performance Optimization

### Async Loading

Load the script asynchronously to avoid blocking page render:

```html
<script src="/tracking-script.js" async></script>
```

### Defer Loading

Defer script execution until page is parsed:

```html
<script src="/tracking-script.js" defer></script>
```

### Lazy Loading

Load tracking only when needed:

```javascript
// Load tracking after 2 seconds
setTimeout(() => {
  const script = document.createElement('script');
  script.src = '/tracking-script.js';
  document.body.appendChild(script);
}, 2000);
```

## Advanced Configuration

### Custom Endpoint

Use a custom tracking endpoint:

```javascript
const TRACKING_ENDPOINT = 'https://custom-domain.com/api/track';
```

### Custom Event Types

Define your own event types:

```javascript
window.MetricsLab.track('custom_event_type', {
  custom_field_1: 'value1',
  custom_field_2: 'value2'
});
```

### Batch Tracking

Queue events and send in batches (custom implementation):

```javascript
const eventQueue = [];

function queueEvent(eventType, data) {
  eventQueue.push({ eventType, data });
  
  if (eventQueue.length >= 10) {
    sendBatch();
  }
}

function sendBatch() {
  // Send all queued events
  eventQueue.forEach(event => {
    window.MetricsLab.track(event.eventType, event.data);
  });
  eventQueue.length = 0;
}
```

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the browser console for errors
- Contact support through your Metrics Lab dashboard
- Check the documentation at your Metrics Lab instance

## Version History

- **v2.0.0**: Enhanced traffic source detection with multi-platform support
- **v1.0.0**: Initial release with basic tracking

---

**Last Updated**: November 2025