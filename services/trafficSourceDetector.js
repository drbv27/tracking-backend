/**
 * Traffic Source Detection Service
 * Analyzes event data to classify traffic sources (organic, paid, referral, direct, social)
 */

class TrafficSourceDetector {
  // Search engines list for organic traffic detection
  static SEARCH_ENGINES = [
    'google.com',
    'google.co.uk',
    'google.ca',
    'google.com.au',
    'bing.com',
    'yahoo.com',
    'duckduckgo.com',
    'baidu.com',
    'yandex.ru',
    'yandex.com'
  ];

  // Social platforms list for social traffic detection
  static SOCIAL_PLATFORMS = [
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'x.com',
    'linkedin.com',
    'youtube.com',
    'tiktok.com',
    'pinterest.com',
    'reddit.com',
    'snapchat.com',
    'whatsapp.com',
    'telegram.org'
  ];

  /**
   * Analyzes event data and returns traffic source classification
   * @param {Object} eventData - Raw event data from tracking script
   * @returns {Object} - { type, platform, medium }
   */
  static detectSource(eventData) {
    // 1. Check for paid traffic (platform-specific click IDs)
    if (eventData.gclid) {
      return {
        type: 'paid',
        platform: 'google',
        medium: eventData.utm_medium || 'cpc'
      };
    }

    if (eventData.fbclid) {
      return {
        type: 'paid',
        platform: 'facebook',
        medium: eventData.utm_medium || 'cpc'
      };
    }

    if (eventData.ttclid) {
      return {
        type: 'paid',
        platform: 'tiktok',
        medium: eventData.utm_medium || 'cpc'
      };
    }

    if (eventData.li_fat_id) {
      return {
        type: 'paid',
        platform: 'linkedin',
        medium: eventData.utm_medium || 'cpc'
      };
    }

    // 2. Check for paid traffic via UTM medium
    if (eventData.utm_medium) {
      const paidMediums = ['cpc', 'ppc', 'paid', 'paidsearch'];
      if (paidMediums.includes(eventData.utm_medium.toLowerCase())) {
        return {
          type: 'paid',
          platform: eventData.utm_source ? eventData.utm_source.toLowerCase() : 'unknown',
          medium: eventData.utm_medium.toLowerCase()
        };
      }
    }

    // 3. Check for social traffic via UTM source
    if (eventData.utm_source) {
      const utmSourceLower = eventData.utm_source.toLowerCase();
      const isSocial = this.SOCIAL_PLATFORMS.some(platform => 
        utmSourceLower.includes(platform.split('.')[0])
      );
      
      if (isSocial) {
        return {
          type: 'social',
          platform: utmSourceLower,
          medium: eventData.utm_medium || 'social'
        };
      }
    }

    // 4. Check referrer-based traffic
    if (eventData.referrer) {
      const referrerDomain = this.extractDomain(eventData.referrer);
      const currentDomain = eventData.pageUrl ? this.extractDomain(eventData.pageUrl) : null;
      
      if (referrerDomain) {
        // Check if referrer is the same domain (self-referral = direct traffic)
        if (currentDomain && referrerDomain === currentDomain) {
          return {
            type: 'direct',
            platform: 'direct',
            medium: 'none'
          };
        }

        // Check if referrer is a search engine (organic traffic)
        const searchEngine = this.identifySearchEngine(referrerDomain);
        if (searchEngine) {
          return {
            type: 'organic',
            platform: searchEngine,
            medium: 'organic'
          };
        }

        // Check if referrer is a social platform
        const isSocial = this.SOCIAL_PLATFORMS.some(platform => 
          referrerDomain.includes(platform)
        );
        
        if (isSocial) {
          const platformName = this.SOCIAL_PLATFORMS.find(platform => 
            referrerDomain.includes(platform)
          ).split('.')[0];
          
          return {
            type: 'social',
            platform: platformName,
            medium: 'referral'
          };
        }

        // Otherwise, it's referral traffic from external domain
        return {
          type: 'referral',
          platform: referrerDomain,
          medium: 'referral'
        };
      }
    }

    // 5. Direct traffic (no referrer, no UTM params, no click IDs)
    return {
      type: 'direct',
      platform: 'direct',
      medium: 'none'
    };
  }

  /**
   * Extracts domain from referrer URL
   * @param {String} referrerUrl - Full referrer URL
   * @returns {String|null} - Domain or null if invalid
   */
  static extractDomain(referrerUrl) {
    if (!referrerUrl || typeof referrerUrl !== 'string') {
      return null;
    }

    try {
      const url = new URL(referrerUrl);
      return url.hostname.toLowerCase();
    } catch (error) {
      // If URL parsing fails, try to extract domain manually
      const match = referrerUrl.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\?#]+)/i);
      return match ? match[1].toLowerCase() : null;
    }
  }

  /**
   * Identifies search engine from referrer domain
   * @param {String} domain - Domain from referrer
   * @returns {String|null} - Search engine name or null
   */
  static identifySearchEngine(domain) {
    if (!domain) {
      return null;
    }

    const domainLower = domain.toLowerCase();

    // Check against known search engines
    for (const searchEngine of this.SEARCH_ENGINES) {
      if (domainLower.includes(searchEngine)) {
        // Extract the search engine name (e.g., 'google' from 'google.com')
        return searchEngine.split('.')[0];
      }
    }

    return null;
  }
}

module.exports = TrafficSourceDetector;
