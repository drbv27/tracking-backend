export default function MetricsCard({ title, value, change, changeType }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">{value}</p>
        {change !== undefined && (
          <span
            className={`text-xs sm:text-sm font-medium ${
              changeType === 'positive'
                ? 'text-green-600'
                : changeType === 'negative'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {changeType === 'positive' && '+'}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
