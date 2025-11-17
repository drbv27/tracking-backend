/**
 * Utility functions for handling API errors and displaying user-friendly messages
 */

/**
 * Get a user-friendly error message from an API error
 * @param {Error} error - The error object from axios or fetch
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(error) {
  // Network errors
  if (!error.response && error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (!error.response) {
    return 'A network error occurred. Please try again.';
  }

  // HTTP status code errors
  const status = error.response?.status;
  const message = error.response?.data?.message || error.response?.data?.error;

  switch (status) {
    case 400:
      return message || 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'A server error occurred. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'The server is temporarily unavailable. Please try again later.';
    default:
      return message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Check if an error is a network error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export function isNetworkError(error) {
  return !error.response || error.message === 'Network Error';
}

/**
 * Check if an error is an authentication error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export function isAuthError(error) {
  return error.response?.status === 401 || error.response?.status === 403;
}

/**
 * Check if an error is a server error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export function isServerError(error) {
  const status = error.response?.status;
  return status >= 500 && status < 600;
}

/**
 * Handle API errors with appropriate actions
 * @param {Error} error - The error object
 * @param {Object} options - Options for error handling
 * @param {Function} options.onAuthError - Callback for authentication errors
 * @param {Function} options.onNetworkError - Callback for network errors
 * @param {Function} options.onServerError - Callback for server errors
 * @returns {string} - Error message
 */
export function handleApiError(error, options = {}) {
  const message = getErrorMessage(error);

  if (isAuthError(error) && options.onAuthError) {
    options.onAuthError(error);
  } else if (isNetworkError(error) && options.onNetworkError) {
    options.onNetworkError(error);
  } else if (isServerError(error) && options.onServerError) {
    options.onServerError(error);
  }

  return message;
}

/**
 * Create a retry function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise}
 */
export async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on auth errors or client errors (4xx except 429)
      if (isAuthError(error) || (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429)) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
