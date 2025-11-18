"use client";

import { useState } from 'react';

export default function InstallationGuide({ projectId, apiKey }) {
    const [showGuide, setShowGuide] = useState(false);
    const [copied, setCopied] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    const trackingScriptCode = `<!-- Metrics Lab Enhanced Tracking Script - WordPress Safe v2.1.0 -->
<script>
(function() {
  // Configuration
  var API_KEY = '${apiKey || 'YOUR_API_KEY_HERE'}';
  var TRACKING_ENDPOINT = '${apiUrl}/track';
  var DEBUG_MODE = false;
  
  // Extract URL parameters (compatible with all browsers)
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
  
  // Debug logging
  function debugLog(message, data) {
    if (DEBUG_MODE && window.console && window.console.log) {
      window.console.log('[Metrics Lab]', message, data || '');
    }
  }
  
  // Send tracking event
  function track(eventType, additionalData) {
    additionalData = additionalData || {};
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      if (window.console && window.console.error) {
        window.console.error('[Metrics Lab] Invalid API key');
      }
      return;
    }
    var urlParams = getUrlParams();
    var data = {
      apiKey: API_KEY,
      event_type: eventType,
      page_url: window.location.href,
      referrer: document.referrer || null,
      timestamp: new Date().toISOString()
    };
    for (var key in urlParams) {
      if (urlParams.hasOwnProperty(key) && urlParams[key] !== null) {
        data[key] = urlParams[key];
      }
    }
    for (var key in additionalData) {
      if (additionalData.hasOwnProperty(key) && additionalData[key] !== null) {
        data[key] = additionalData[key];
      }
    }
    debugLog('Tracking:', data);
    if (window.fetch) {
      fetch(TRACKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).then(function(response) {
        if (response.ok) debugLog('Success:', eventType);
      }).catch(function(err) {
        debugLog('Error:', err);
      });
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', TRACKING_ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    }
  }
  
  // Track page view
  function trackPageView() {
    track('page_view');
  }
  
  // Track clicks
  function trackClick(element) {
    var buttonText = null;
    if (element.textContent) {
      buttonText = element.textContent.trim();
      if (buttonText.length > 100) buttonText = buttonText.substring(0, 100);
    }
    track('click', {
      clicked_url: element.href || window.location.href,
      button_id: element.id || null,
      button_href: element.getAttribute('href') || null,
      button_text: buttonText,
      button_class: element.className || null
    });
  }
  
  // Track call clicks
  function trackCallClick(element) {
    track('call_click', {
      phone_number: element.href.replace('tel:', '').trim(),
      button_id: element.id || null,
      button_text: element.textContent ? element.textContent.trim() : null
    });
  }
  
  // Track form submits
  function trackFormSubmit(form) {
    track('form_submit', {
      form_id: form.id || null,
      form_name: form.name || null,
      form_action: form.action || null
    });
  }
  
  // Initialize tracking
  function initialize() {
    debugLog('Initializing...');
    trackPageView();
    if (document.addEventListener) {
      document.addEventListener('click', function(event) {
        var element = event.target;
        while (element && element !== document) {
          if (element.tagName === 'A' || element.tagName === 'BUTTON') {
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
      document.addEventListener('submit', function(event) {
        var form = event.target;
        if (form && form.tagName === 'FORM') trackFormSubmit(form);
      }, true);
    }
    debugLog('Initialized');
  }
  
  // Safe initialization
  function safeInitialize() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initialize();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', initialize);
    } else if (document.attachEvent) {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete') initialize();
      });
    } else {
      window.onload = initialize;
    }
  }
  
  safeInitialize();
  
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
</script>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(trackingScriptCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadScript = () => {
        const blob = new Blob([trackingScriptCode.replace('<!-- Metrics Lab Enhanced Tracking Script -->\n<script>\n', '').replace('\n</script>', '')], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'metrics-lab-tracking.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            {/* Installation Button */}
            <button
                onClick={() => setShowGuide(!showGuide)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Installation Guide
            </button>

            {/* Installation Guide Modal/Panel */}
            {showGuide && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setShowGuide(false)}>
                    <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b">
                            <h3 className="text-2xl font-bold text-gray-900">
                                Installation Guide
                            </h3>
                            <button
                                onClick={() => setShowGuide(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Quick Start */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h4>
                                <p className="text-gray-600 mb-4">
                                    Add the tracking script to your website to start collecting analytics data. The script automatically tracks:
                                </p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                                    <li>Page views and navigation</li>
                                    <li>Button and link clicks</li>
                                    <li>Traffic sources (organic, paid, referral, direct)</li>
                                    <li>Campaign parameters (UTM, gclid, fbclid, etc.)</li>
                                    <li>Referrer information</li>
                                </ul>
                            </div>

                            {/* Installation Steps */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Installation Steps</h4>
                                <div className="space-y-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                                                1
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h5 className="font-medium text-gray-900">Copy the tracking script</h5>
                                            <p className="text-sm text-gray-600">Use the code below with your API key already configured</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                                                2
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h5 className="font-medium text-gray-900">Add to your website</h5>
                                            <p className="text-sm text-gray-600">Paste the script before the closing &lt;/body&gt; tag in your HTML</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                                                3
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h5 className="font-medium text-gray-900">Verify installation</h5>
                                            <p className="text-sm text-gray-600">Visit your website and check this dashboard for incoming events</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Script Code */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg font-semibold text-gray-900">Tracking Script</h4>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            {copied ? (
                                                <>
                                                    <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={downloadScript}
                                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-sm text-gray-100 whitespace-pre-wrap break-words">
                                        <code>{trackingScriptCode}</code>
                                    </pre>
                                </div>
                            </div>

                            {/* Testing */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Testing Your Installation</h4>
                                <p className="text-gray-600 mb-3">
                                    Test different traffic sources by visiting your website with these URL parameters:
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Google Ads:</span>
                                        <code className="ml-2 text-blue-600">?gclid=test123&utm_source=google&utm_medium=cpc</code>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Facebook Ads:</span>
                                        <code className="ml-2 text-blue-600">?fbclid=test456&utm_source=facebook&utm_medium=cpc</code>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Email Campaign:</span>
                                        <code className="ml-2 text-blue-600">?utm_source=newsletter&utm_medium=email&utm_campaign=weekly</code>
                                    </div>
                                </div>
                            </div>

                            {/* Framework Integration */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Framework Integration</h4>
                                <div className="space-y-3">
                                    <details className="bg-gray-50 rounded-lg p-4">
                                        <summary className="font-medium text-gray-900 cursor-pointer">React / Next.js</summary>
                                        <div className="mt-3 text-sm text-gray-600">
                                            <p className="mb-2">Add to your layout or _app.js:</p>
                                            <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
{`import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Script src="/tracking-script.js" strategy="afterInteractive" />
    </>
  );
}`}
                                            </pre>
                                        </div>
                                    </details>
                                    <details className="bg-gray-50 rounded-lg p-4">
                                        <summary className="font-medium text-gray-900 cursor-pointer">WordPress</summary>
                                        <div className="mt-3 text-sm text-gray-600">
                                            <p>Add to your theme&apos;s footer.php before &lt;/body&gt; or use a plugin like &quot;Insert Headers and Footers&quot;</p>
                                        </div>
                                    </details>
                                    <details className="bg-gray-50 rounded-lg p-4">
                                        <summary className="font-medium text-gray-900 cursor-pointer">Shopify</summary>
                                        <div className="mt-3 text-sm text-gray-600">
                                            <p>Go to Online Store → Themes → Actions → Edit code → theme.liquid and add before &lt;/body&gt;</p>
                                        </div>
                                    </details>
                                </div>
                            </div>

                            {/* Additional Resources */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Additional Resources</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a 
                                            href={`${apiUrl}/tracking-script.js`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            View full tracking script with examples
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                            href={`${apiUrl}/tracking-installation-guide.md`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Complete installation guide
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t flex justify-end">
                            <button
                                onClick={() => setShowGuide(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
