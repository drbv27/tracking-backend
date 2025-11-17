'use client';

import { useState } from 'react';

export default function DateRangePicker({ value, onChange }) {
  const [isCustom, setIsCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const presets = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
  ];

  const handlePresetChange = (days) => {
    setIsCustom(false);
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onChange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    });
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onChange({
        startDate: customStart,
        endDate: customEnd,
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <select
        className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm px-2 sm:px-3 py-2 border"
        value={isCustom ? 'custom' : value?.days || 30}
        onChange={(e) => {
          if (e.target.value === 'custom') {
            setIsCustom(true);
          } else {
            handlePresetChange(parseInt(e.target.value));
          }
        }}
      >
        {presets.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
        <option value="custom">Custom range</option>
      </select>

      {isCustom && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm px-2 sm:px-3 py-2 border"
          />
          <span className="text-gray-500 text-xs sm:text-sm text-center sm:inline">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm px-2 sm:px-3 py-2 border"
          />
          <button
            onClick={handleCustomApply}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
