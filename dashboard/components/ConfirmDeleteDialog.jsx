/**
 * ConfirmDeleteDialog Component
 * 
 * A modal dialog that asks for user confirmation before deleting a project.
 * Displays a warning message and lists what will be permanently deleted.
 * 
 * @param {boolean} isOpen - Whether the dialog is visible
 * @param {string} projectName - Name of the project to be deleted
 * @param {function} onConfirm - Callback when user confirms deletion
 * @param {function} onCancel - Callback when user cancels deletion
 * @param {boolean} isLoading - Whether deletion is in progress
 */
export default function ConfirmDeleteDialog({ 
  isOpen, 
  projectName, 
  onConfirm, 
  onCancel, 
  isLoading 
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={!isLoading ? onCancel : undefined}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Title */}
          <h2 
            id="dialog-title"
            className="text-xl font-bold text-gray-900 mb-4"
          >
            ¿Eliminar Proyecto?
          </h2>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 mb-3">
              ¿Estás seguro de que deseas eliminar <strong className="text-gray-900">"{projectName}"</strong>?
            </p>

            <p className="text-gray-700 mb-2">
              Esto eliminará permanentemente:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-3">
              <li>Todos los eventos de tracking</li>
              <li>Todos los datos de analytics</li>
              <li>La configuración del proyecto</li>
            </ul>

            <p className="text-red-600 font-semibold">
              ⚠️ Esta acción no se puede deshacer.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Eliminando...
                </span>
              ) : (
                'Eliminar Proyecto'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
