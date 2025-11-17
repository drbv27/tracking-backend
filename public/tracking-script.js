/**
 * Metrics Lab Enhanced Tracking Script
 * 
 * This script automatically tracks page views and user interactions with comprehensive
 * traffic source detection including organic, paid campaigns (Google Ads, Facebook Ads,
 * TikTok Ads, LinkedIn Ads), referral traffic, and direct visits.
 * 
 * Features:
 * - Automatic traffic source detection
 * - Support for multiple ad platforms (Google, Facebook, Instagram, TikTok, LinkedIn)
 * - UTM parameter tracking
 * - Referrer tracking
 * - Click event tracking
 * - Page view tracking
 * 
 * @version 2.0.0
 */

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  
  /**
   * Replace with your actual API key from Metrics Lab dashboard
   * You can find this in your project settings
   */
  const API_KEY = 'YOUR_API_KEY_HERE';
  
  /**
   * Tracking endpoint URL
   * Update this to match your Metrics Lab backend URL
   */
  const TRACKING_ENDPOINT = 'https://your-domain.com/track';
  
  /**
   * Enable debug mode to see tracking events in console
   * Set to false in production
   */
  const DEBUG_MODE = false;

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Extracts all URL parameters from the current page URL
   * Captures platform-specific tracking IDs and UTM parameters
   * 
   * Supported parameters:
   * - gclid: Google Ads Click ID
   * - fbclid: Facebook Ads Click ID
   * - ttclid: TikTok Ads Click ID
   * - li_fat_id: LinkedIn First-party Ad Tracking ID
   * - utm_source: Campaign source (e.g., google, facebook, newsletter)
   * - utm_medium: Campaign medium (e.g., cpc, email, social)
   * - utm_campaign: Campaign name
   * - utm_term: Campaign term (for paid search keywords)
   * - utm_content: Campaign content (for A/B testing)
   * 
   * @returns {Object} Object containing all URL parameters
   */
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    return {
      // Platform-specific tracking IDs
      gclid: params.get('gclid') || null,
      fbclid: params.get('fbclid') || null,
      ttclid: params.get('ttclid') || null,
      li_fat_id: params.get('li_fat_id') || null,
      
      // UTM parameters
      utm_source: params.get('utm_source') || null,
      utm_medium: params.get('utm_medium') || null,
      utm_campaign: params.get('utm_campaign') || null,
      utm_term: params.get('utm_term') || null,
      utm_content: params.get('utm_content') || null
    };
  }

  /**
   * Captures the document referrer (the page that linked to this page)
   * Returns null if no referrer is available (direct traffic or privacy settings)
   * 
   * @returns {string|null} Full referrer URL or null
   */
  function getReferrer() {
    return document.referrer || null;
  }

  /**
   * Logs debug information to console when DEBUG_MODE is enabled
   * 
   * @param {string} message - Debug message
   * @param {Object} data - Additional data to log
   */
  function debugLog(message, data) {
    if (DEBUG_MODE) {
      console.log('[Metrics Lab]', message, data);
    }
  }

  // ============================================================================
  // TRACKING FUNCTIONS
  // ============================================================================

  /**
   * Sends a tracking event to the Metrics Lab backend
   * 
   * @param {string} eventType - Type of event (e.g., 'page_view', 'click')
   * @param {Object} additionalData - Additional event data to include
   * @returns {Promise} Fetch promise
   */
  function track(eventType, additionalData) {
    // Handle default parameter
    additionalData = additionalData || {};
    
    // Validate API key
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      console.error('[Metrics Lab] Invalid API key. Please configure your API key.');
      return Promise.reject(new Error('Invalid API key'));
    }

    // Build tracking payload
    var urlParams = getUrlParams();
    var data = {
      apiKey: API_KEY,
      event_type: eventType,
      page_url: window.location.href,
      referrer: getReferrer(),
      timestamp: new Date().toISOString()
    };
    
    // Merge URL parameters (replaces spread operator)
    for (var key in urlParams) {
      if (urlParams.hasOwnProperty(key)) {
        data[key] = urlParams[key];
      }
    }
    
    // Merge additional data (replaces spread operator)
    for (var key in additionalData) {
      if (additionalData.hasOwnProperty(key)) {
        data[key] = additionalData[key];
      }
    }

    // Remove null values to reduce payload size
    Object.keys(data).forEach(function(key) {
      if (data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });

    debugLog('Sending tracking event:', data);

    // Send tracking request
    return fetch(TRACKING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      // Use keepalive to ensure tracking completes even if user navigates away
      keepalive: true
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Tracking failed: ' + response.status);
      }
      debugLog('Tracking successful:', eventType);
      return response;
    })
    .catch(function(err) {
      console.error('[Metrics Lab] Tracking error:', err);
      throw err;
    });
  }

  /**
   * Tracks a page view event
   * Automatically called on page load
   */
  function trackPageView() {
    track('page_view')
      .catch(function() {
        // Silently fail - don't disrupt user experience
      });
  }

  /**
   * Tracks a click event on buttons and links
   * 
   * @param {HTMLElement} element - The clicked element
   */
  function trackClick(element) {
    var buttonText = element.textContent ? element.textContent.trim().substring(0, 100) : null;
    
    var clickData = {
      clicked_url: element.href || window.location.href,
      button_id: element.id || null,
      button_href: element.getAttribute('href') || null,
      button_text: buttonText,
      button_class: element.className || null
    };

    track('click', clickData)
      .catch(function() {
        // Silently fail - don't disrupt user experience
      });
  }

  /**
   * Tracks a call button click event
   * Specifically tracks clicks on phone number links (tel: links)
   * 
   * @param {HTMLElement} element - The clicked call button
   */
  function trackCallClick(element) {
    var phoneNumber = element.href.replace('tel:', '').trim();
    var buttonText = element.textContent ? element.textContent.trim() : null;
    
    var callData = {
      event_type: 'call_click',
      phone_number: phoneNumber,
      button_id: element.id || null,
      button_text: buttonText,
      button_class: element.className || null
    };

    track('call_click', callData)
      .catch(function() {
        // Silently fail - don't disrupt user experience
      });
  }

  /**
   * Tracks a form submission event
   * 
   * @param {HTMLFormElement} form - The submitted form
   */
  function trackFormSubmit(form) {
    var formData = {
      form_id: form.id || null,
      form_name: form.name || null,
      form_action: form.action || null,
      form_method: form.method || 'get'
    };

    track('form_submit', formData)
      .catch(function() {
        // Silently fail - don't disrupt user experience
      });
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  /**
   * Initialize tracking when DOM is ready
   */
  function initialize() {
    debugLog('Initializing Metrics Lab tracking...');

    // Track initial page view
    trackPageView();

    // Track clicks on links and buttons
    document.addEventListener('click', function(event) {
      // Find the closest link or button element
      const element = event.target.closest('a, button');
      
      if (element) {
        // Check if it's a phone call link
        if (element.tagName === 'A' && element.href && element.href.startsWith('tel:')) {
          trackCallClick(element);
        } else {
          trackClick(element);
        }
      }
    }, true); // Use capture phase to catch events early

    // Track form submissions
    document.addEventListener('submit', function(event) {
      const form = event.target;
      if (form.tagName === 'FORM') {
        trackFormSubmit(form);
      }
    }, true);

    debugLog('Metrics Lab tracking initialized');
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM is already ready
    initialize();
  }

  // Expose track function globally for custom event tracking
  window.MetricsLab = {
    track: track,
    trackPageView: trackPageView,
    trackCallClick: trackCallClick,
    trackFormSubmit: trackFormSubmit,
    version: '2.0.0'
  };

})();

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: Basic Installation
 * ------------------------------
 * Add this script to your HTML before the closing </body> tag:
 * 
 * <script src="/tracking-script.js"></script>
 * 
 * Or load it from your CDN:
 * 
 * <script src="https://your-cdn.com/tracking-script.js"></script>
 */

/**
 * EXAMPLE 2: Custom Event Tracking
 * ---------------------------------
 * Track custom events using the global MetricsLab object:
 * 
 * // Track a form submission
 * document.querySelector('#contact-form').addEventListener('submit', function(e) {
 *   window.MetricsLab.track('form_submit', {
 *     form_id: 'contact-form',
 *     form_name: 'Contact Us'
 *   });
 * });
 * 
 * // Track a video play
 * document.querySelector('#video').addEventListener('play', function() {
 *   window.MetricsLab.track('video_play', {
 *     video_id: 'intro-video',
 *     video_title: 'Product Introduction'
 *   });
 * });
 * 
 * // Track a purchase
 * window.MetricsLab.track('purchase', {
 *   product_id: '12345',
 *   product_name: 'Premium Plan',
 *   amount: 99.99,
 *   currency: 'USD'
 * });
 */

/**
 * EXAMPLE 3: Single Page Application (SPA) Integration
 * -----------------------------------------------------
 * For React, Vue, or other SPAs, track route changes:
 * 
 * // React Router example
 * import { useEffect } from 'react';
 * import { useLocation } from 'react-router-dom';
 * 
 * function App() {
 *   const location = useLocation();
 *   
 *   useEffect(() => {
 *     if (window.MetricsLab) {
 *       window.MetricsLab.trackPageView();
 *     }
 *   }, [location]);
 *   
 *   return <YourApp />;
 * }
 */

/**
 * EXAMPLE 4: Testing Traffic Sources
 * -----------------------------------
 * Test different traffic sources by adding parameters to your URL:
 * 
 * Google Ads:
 * https://yoursite.com/?gclid=test123&utm_source=google&utm_medium=cpc&utm_campaign=summer_sale
 * 
 * Facebook Ads:
 * https://yoursite.com/?fbclid=test456&utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale
 * 
 * TikTok Ads:
 * https://yoursite.com/?ttclid=test789&utm_source=tiktok&utm_medium=cpc&utm_campaign=summer_sale
 * 
 * LinkedIn Ads:
 * https://yoursite.com/?li_fat_id=test999&utm_source=linkedin&utm_medium=cpc&utm_campaign=summer_sale
 * 
 * Email Campaign:
 * https://yoursite.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly_digest
 * 
 * Organic (visit from Google search):
 * https://yoursite.com/ (with referrer: https://www.google.com/search?q=...)
 * 
 * Direct (type URL directly):
 * https://yoursite.com/ (no referrer, no parameters)
 */
