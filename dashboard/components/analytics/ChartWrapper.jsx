export default function ChartWrapper({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 sm:p-6 ${className}`}>
      {title && (
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{title}</h3>
      )}
      <div className="w-full overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
