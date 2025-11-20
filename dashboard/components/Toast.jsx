/**
 * Toast Component
 * 
 * A notification component that displays temporary messages to users.
 * Supports success and error types with auto-dismiss functionality.
 * 
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success' or 'error'
 * @param {function} onClose - Callback when toast is dismissed
 */
export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const icon = isSuccess ? (
    // Checkmark icon
    <svg 
      className="w-6 h-6 text-white" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M5 13l4 4L19 7" 
      />
    </svg>
  ) : (
    // Error icon
    <svg 
      className="w-6 h-6 text-white" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M6 18L18 6M6 6l12 12" 
      />
    </svg>
  );

  return (
    <div 
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md animate-slide-in`}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {icon}
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white hover:text-gray-200 transition"
        aria-label="Cerrar notificación"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>
    </div>
  );
}
