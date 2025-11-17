# Error Handling and User Feedback Implementation

This document describes the comprehensive error handling and user feedback system implemented for the analytics dashboard.

## Components

### 1. ErrorBoundary Component
**Location:** `dashboard/components/analytics/ErrorBoundary.jsx`

A React Error Boundary that catches rendering errors in child components and displays a user-friendly error message.

**Features:**
- Catches JavaScript errors anywhere in the child component tree
- Displays a friendly error message with retry functionality
- Shows detailed error information in development mode
- Prevents the entire app from crashing due to component errors

**Usage:**
```jsx
<ErrorBoundary onReset={() => handleReset()}>
  <YourComponent />
</ErrorBoundary>
```

### 2. Toast Notification System
**Location:** `dashboard/components/analytics/Toast.jsx` and `ToastContainer.jsx`

A toast notification system for displaying temporary messages to users.

**Features:**
- Multiple toast types: error, success, warning, info
- Auto-dismiss after configurable duration
- Retry button for failed operations
- Smooth slide-in animation
- Stacked notifications support

**Usage:**
```jsx
// Wrap your app with ToastProvider
<ToastProvider>
  <YourApp />
</ToastProvider>

// Use the toast hook in components
const { showError, showSuccess, showWarning, showInfo } = useToast();

// Show error with retry option
showError('Failed to load data', {
  onRetry: () => fetchData(),
  duration: 5000
});

// Show success message
showSuccess('Data saved successfully');
```

### 3. Error Handler Utilities
**Location:** `dashboard/utils/errorHandler.js`

Utility functions for consistent error handling across the application.

**Functions:**

- `getErrorMessage(error)` - Converts API errors to user-friendly messages
- `isNetworkError(error)` - Checks if error is a network error
- `isAuthError(error)` - Checks if error is an authentication error
- `isServerError(error)` - Checks if error is a server error
- `handleApiError(error, options)` - Handles API errors with callbacks
- `retryWithBackoff(fn, maxRetries, initialDelay)` - Retries failed operations with exponential backoff

**Usage:**
```jsx
import { getErrorMessage, isAuthError } from '../../utils/errorHandler';

try {
  await fetchData();
} catch (err) {
  const message = getErrorMessage(err);
  if (!isAuthError(err)) {
    showError(message, { onRetry: fetchData });
  }
}
```

## Error Handling Patterns

### 1. API Error Handling in Tab Components

All tab components (OverviewTab, OrganicTab, CampaignsTab, ReferralsTab, DirectTab) follow this pattern:

```jsx
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await axios.get(url, config);
    setData(response.data);
  } catch (err) {
    console.error('Error:', err);
    const message = getErrorMessage(err);
    setError(message);
    
    // Show toast for non-auth errors
    if (!isAuthError(err)) {
      showError(message, {
        onRetry: fetchData
      });
    }
  } finally {
    setLoading(false);
  }
};
```

### 2. Graceful Degradation

The main project page implements graceful degradation for event counts:

```jsx
try {
  const response = await fetch(url);
  if (response.ok) {
    setEventCounts(data);
  } else {
    // Graceful degradation - show zeros
    setEventCounts({ total: 0, organic: 0, paid: 0, referral: 0, direct: 0 });
  }
} catch (error) {
  // Graceful degradation - show zeros
  setEventCounts({ total: 0, organic: 0, paid: 0, referral: 0, direct: 0 });
}
```

### 3. Error Boundaries for Tab Content

Each tab is wrapped in an ErrorBoundary to prevent rendering errors from crashing the entire page:

```jsx
<ErrorBoundary key="overview" onReset={() => setActiveTab('overview')}>
  <OverviewTab {...tabProps} />
</ErrorBoundary>
```

## User-Friendly Error Messages

The error handler provides specific messages for common scenarios:

- **Network Errors:** "Unable to connect to the server. Please check your internet connection."
- **401 Unauthorized:** "Your session has expired. Please log in again."
- **403 Forbidden:** "You do not have permission to access this resource."
- **404 Not Found:** "The requested resource was not found."
- **429 Too Many Requests:** "Too many requests. Please wait a moment and try again."
- **500 Server Error:** "A server error occurred. Please try again later."
- **502/503/504:** "The server is temporarily unavailable. Please try again later."

## Loading States

All tab components use the `LoadingState` component to show skeleton loaders while data is being fetched:

```jsx
if (loading) {
  return <LoadingState />;
}
```

## Empty States

When no data is available, components show helpful empty states with guidance:

```jsx
if (!data || data.totalEvents === 0) {
  return (
    <EmptyState
      title="No tracking data yet"
      message="Start tracking events on your website to see analytics here."
      icon="chart"
    />
  );
}
```

## Retry Functionality

Users can retry failed operations in two ways:

1. **Retry button in error state:**
```jsx
<EmptyState
  title="Error loading data"
  message={error}
  icon="chart"
  actionText="Retry"
  onAction={fetchData}
/>
```

2. **Retry button in toast notification:**
```jsx
showError(message, {
  onRetry: fetchData
});
```

## Best Practices

1. **Always catch errors** - Never let errors propagate unhandled
2. **Provide context** - Error messages should explain what went wrong and what the user can do
3. **Enable retry** - Give users the ability to retry failed operations
4. **Log errors** - Always log errors to console for debugging
5. **Graceful degradation** - Show partial data or empty states instead of breaking the UI
6. **Don't show auth errors in toasts** - Auth errors should redirect to login, not show toasts
7. **Use loading states** - Always show loading indicators during async operations
8. **Test error scenarios** - Test network errors, server errors, and edge cases

## Testing Error Handling

To test error handling:

1. **Network errors:** Disconnect from internet and try to load data
2. **Server errors:** Stop the backend server and try to load data
3. **Auth errors:** Use an expired token
4. **Rendering errors:** Introduce a bug in a component to trigger ErrorBoundary
5. **Empty states:** Use a date range with no data

## Future Enhancements

Potential improvements to consider:

1. **Offline support** - Cache data for offline viewing
2. **Error reporting** - Send errors to a monitoring service (e.g., Sentry)
3. **Retry with backoff** - Implement automatic retry with exponential backoff
4. **Rate limiting feedback** - Show countdown timer for rate-limited requests
5. **Partial data loading** - Load and show partial data even if some requests fail
