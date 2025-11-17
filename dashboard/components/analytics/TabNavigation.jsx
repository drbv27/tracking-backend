export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex flex-col sm:flex-row sm:space-x-8 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-3 sm:py-4 px-4 sm:px-1 border-b-2 sm:border-b-2 border-l-4 sm:border-l-0 font-medium text-sm whitespace-nowrap
              transition-colors duration-200 text-left sm:text-center
              ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50 sm:bg-transparent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="flex items-center justify-between sm:inline">
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
