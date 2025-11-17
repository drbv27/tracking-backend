'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import MetricsCard from './MetricsCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ChartWrapper from './ChartWrapper';
import { useToast } from './ToastContainer';
import { getErrorMessage, isAuthError } from '../../utils/errorHandler';

const SEARCH_ENGINE_COLORS = {
  google: '#4285f4',
  bing: '#008373',
  yahoo: '#7b0099',
  duckduckgo: '#de5833',
  baidu: '#2319dc',
  yandex: '#ff0000'
};

export default function OrganicTab({ projectId, dateRange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useToast();
  const hasShownErrorRef = useRef(false);

  const fetchOrganicData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (dateRange?.start) {
        params.append('startDate', dateRange.start);
      }
      if (dateRange?.end) {
        params.append('endDate', dateRange.end);
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/analytics/organic?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setData(response.data);
      hasShownErrorRef.current = false;
    } catch (err) {
      console.error('Error fetching organic data:', err);
      const message = getErrorMessage(err);
      setError(message);
      
      // Show toast notification for errors only once
      if (!isAuthError(err) && !hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        showError(message, {
          onRetry: () => {
            hasShownErrorRef.current = false;
            fetchOrganicData();
          }
        });
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, dateRange, showError]);

  useEffect(() => {
    fetchOrganicData();
  }, [fetchOrganicData]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading data"
        message={error}
        icon="search"
        actionText="Retry"
        onAction={fetchOrganicData}
      />
    );
  }

  if (!data || data.totalOrganic === 0) {
    return (
      <EmptyState
        title="No organic traffic yet"
        message="Organic traffic from search engines will appear here once visitors arrive from Google, Bing, or other search engines."
        icon="search"
      />
    );
  }

  // Prepare data for horizontal bar chart
  const searchEngineData = (data.bySearchEngine || []).map(engine => ({
    name: engine.engine.charAt(0).toUpperCase() + engine.engine.slice(1),
    count: engine.count,
    percentage: engine.percentage
  }));

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Total Organic Visits"
          value={data.totalOrganic.toLocaleString()}
        />
        <MetricsCard
          title="Search Engines"
          value={data.bySearchEngine?.length || 0}
        />
        <MetricsCard
          title="Landing Pages"
          value={data.topLandingPages?.length || 0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Search Engine Breakdown - Horizontal Bar Chart */}
        <ChartWrapper title="Search Engine Breakdown">
          {searchEngineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart 
                data={searchEngineData} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  stroke="#6b7280"
                  style={{ fontSize: '10px' }}
                  className="sm:text-xs"
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#6b7280"
                  style={{ fontSize: '10px' }}
                  className="sm:text-xs"
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(value, name, props) => [
                    `${value.toLocaleString()} visits (${props.payload.percentage}%)`,
                    'Visits'
                  ]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {searchEngineData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={SEARCH_ENGINE_COLORS[entry.name.toLowerCase()] || '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm">
              No search engine data available
            </div>
          )}
        </ChartWrapper>

        {/* Top Landing Pages Table */}
        <ChartWrapper title="Top Landing Pages">
          {data.topLandingPages && data.topLandingPages.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page URL
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visits
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.topLandingPages.slice(0, 10).map((page, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 max-w-[200px] sm:max-w-xs truncate" title={page.url}>
                        {page.url}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right font-semibold">
                        {page.count.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm">
              No landing page data available
            </div>
          )}
        </ChartWrapper>
      </div>

      {/* Organic Traffic Trend Line Chart */}
      <ChartWrapper title="Organic Traffic Trend">
        {data.trend && data.trend.length > 0 ? (
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '10px' }}
                className="sm:text-xs"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '10px' }}
                className="sm:text-xs"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                formatter={(value) => [value.toLocaleString(), 'Organic Visits']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
                activeDot={{ r: 5 }}
                name="Organic Visits"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm">
            No trend data available
          </div>
        )}
      </ChartWrapper>
    </div>
  );
}
