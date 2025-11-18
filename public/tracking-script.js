/**
 * Metrics Lab Enhanced Tracking Script
 * WordPress & Cache-Plugin Safe Version
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
 * - ES5 compatible (works with all cache plugins and minifiers)
 * 
 * @version 2.1.0
 */

(function() {
  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  
  /**
   * Replace with your actual API key from Metrics Lab dashboard
   * You can find this in your project settings
   */
  var API_KEY = 'YOUR_API_KEY_HERE';
  
  /**
   * Tracking endpoint URL
   * Update this to match your Metrics Lab backend URL
   */
  var TRACKING_ENDPOINT = 'https://your-domain.com/track';
  
  /**
   * Enable debug mode to see tracking events in console
   * Set to false in production
   */
  var DEBUG_MODE = false;

  // ============================================================================
  // UTILITY FUNCTIONS - WordPress & Cache Safe
  // ============================================================================

  /**
   * Extracts all URL parameters from the current page URL
   * Compatible with older browsers and WordPress cache plugins
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
    var params = {};
    var search = window.location.search.substring(1);
    
    if (search) {
      var pairs = search.split('&');
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        if (pair.length === 2) {
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
      }
    }
    
    return {
      gclid: params.gclid || null,
      fbclid: params.fbclid || null,
      ttclid: params.ttclid || null,
      li_fat_id: params.li_fat_id || null,
      utm_source: params.utm_source || null,
      utm_medium: params.utm_medium || null,
      utm_campaign: params.utm_campaign || null,
      utm_term: params.utm_term || null,
      utm_content: params.utm_content || null
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
   * Safe for all browsers and WordPress environments
   * 
   * @param {string} message - Debug message
   * @param {*} data - Additional data to log
   */
  function debugLog(message, data) {
    if (DEBUG_MODE && window.console && window.console.log) {
      window.console.log('[Metrics Lab]', message, data || '');
    }
  }

  // ============================================================================
  // TRACKING FUNCTIONS - WordPress & Cache Safe
  // ============================================================================

  /**
   * Sends a tracking event to the Metrics Lab backend
   * Compatible with all browsers and WordPress environments
   * 
   * @param {string} eventType - Type of event (e.g., 'page_view', 'click')
   * @param {Object} additionalData - Additional event data to include
   */
  function track(eventType, additionalData) {
    // Handle default parameter
    additionalData = additionalData || {};
    
    // Validate API key
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      if (window.console && window.console.error) {
        window.console.error('[Metrics Lab] Invalid API key. Please configure your API key.');
      }
      return;
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
    
    // Merge URL parameters
    for (var key in urlParams) {
      if (urlParams.hasOwnProperty(key) && urlParams[key] !== null) {
        data[key] = urlParams[key];
      }
    }
    
    // Merge additional data
    for (var key in additionalData) {
      if (additionalData.hasOwnProperty(key) && additionalData[key] !== null) {
        data[key] = additionalData[key];
      }
    }

    debugLog('Sending tracking event:', data);

    // Send tracking request with fallback for older browsers
    if (window.fetch) {
      fetch(TRACKING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        keepalive: true
      })
      .then(function(response) {
        if (response.ok) {
          debugLog('Tracking successful:', eventType);
        }
      })
      .catch(function(err) {
        debugLog('Tracking error:', err);
      });
    } else {
      // Fallback for very old browsers
      var xhr = new XMLHttpRequest();
      xhr.open('POST', TRACKING_ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    }
  }

  /**
   * Tracks a page view event
   * WordPress safe version
   */
  function trackPageView() {
    track('page_view');
  }

  /**
   * Tracks a click event on buttons and links
   * WordPress safe version
   * 
   * @param {HTMLElement} element - The clicked element
   */
  function trackClick(element) {
    var buttonText = null;
    if (element.textContent) {
      buttonText = element.textContent.trim();
      if (buttonText.length > 100) {
        buttonText = buttonText.substring(0, 100);
      }
    }
    
    var clickData = {
      clicked_url: element.href || window.location.href,
      button_id: element.id || null,
      button_href: element.getAttribute('href') || null,
      button_text: buttonText,
      button_class: element.className || null
    };

    track('click', clickData);
  }

  /**
   * Tracks a call button click event
   * Specifically tracks clicks on phone number links (tel: links)
   * WordPress safe version
   * 
   * @param {HTMLElement} element - The clicked call button
   */
  function trackCallClick(element) {
    var phoneNumber = element.href.replace('tel:', '').trim();
    var buttonText = element.textContent ? element.textContent.trim() : null;
    
    var callData = {
      phone_number: phoneNumber,
      button_id: element.id || null,
      button_text: buttonText,
      button_class: element.className || null
    };

    track('call_click', callData);
  }

  /**
   * Tracks a form submission event
   * WordPress safe version
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

    track('form_submit', formData);
  }

  // ============================================================================
  // EVENT LISTENERS - WordPress & Cache Safe
  // ============================================================================

  /**
   * Initialize tracking when DOM is ready
   * Compatible with all WordPress themes and plugins
   */
  function initialize() {
    debugLog('Initializing Metrics Lab tracking...');

    // Track initial page view
    trackPageView();

    // Track clicks on links and buttons - WordPress safe
    if (document.addEventListener) {
      document.addEventListener('click', function(event) {
        var element = event.target;
        
        // Find the closest link or button element (manual traversal for compatibility)
        while (element && element !== document) {
          if (element.tagName === 'A' || element.tagName === 'BUTTON') {
            // Check if it's a phone call link
            if (element.tagName === 'A' && element.href && element.href.indexOf('tel:') === 0) {
              trackCallClick(element);
            } else {
              trackClick(element);
            }
            break;
          }
          element = element.parentNode;
        }
      }, true);

      // Track form submissions
      document.addEventListener('submit', function(event) {
        var form = event.target;
        if (form && form.tagName === 'FORM') {
          trackFormSubmit(form);
        }
      }, true);
    }

    debugLog('Metrics Lab tracking initialized');
  }

  // ============================================================================
  // INITIALIZATION - WordPress Safe
  // ============================================================================

  /**
   * Safe initialization with multiple fallbacks
   * Ensures compatibility with all WordPress environments
   */
  function safeInitialize() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initialize();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', initialize);
    } else if (document.attachEvent) {
      // IE8 fallback
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete') {
          initialize();
        }
      });
    } else {
      // Ultimate fallback
      window.onload = initialize;
    }
  }

  // Start initialization
  safeInitialize();

  // Expose functions globally for custom event tracking
  // Safe global assignment
  if (typeof window !== 'undefined') {
    window.MetricsLab = {
      track: track,
      trackPageView: trackPageView,
      trackCallClick: trackCallClick,
      trackFormSubmit: trackFormSubmit,
      version: '2.1.0'
    };
  }

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
