'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MetricsCard from './MetricsCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ChartWrapper from './ChartWrapper';
import { useToast } from './ToastContainer';
import { getErrorMessage, isAuthError } from '../../utils/errorHandler';

export default function DirectTab({ projectId, dateRange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useToast();
  const hasShownErrorRef = useRef(false);

  const fetchDirectData = useCallback(async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/analytics/direct?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setData(response.data);
      hasShownErrorRef.current = false;
    } catch (err) {
      console.error('Error fetching direct traffic data:', err);
      const message = getErrorMessage(err);
      setError(message);
      
      // Show toast notification for errors only once
      if (!isAuthError(err) && !hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        showError(message, {
          onRetry: () => {
            hasShownErrorRef.current = false;
            fetchDirectData();
          }
        });
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, dateRange, showError]);

  useEffect(() => {
    fetchDirectData();
  }, [fetchDirectData]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading data"
        message={error}
        icon="inbox"
        actionText="Retry"
        onAction={fetchDirectData}
      />
    );
  }

  if (!data || data.totalDirect === 0) {
    return (
      <EmptyState
        title="No direct traffic yet"
        message="Direct traffic occurs when visitors type your URL directly or use bookmarks. This data will appear once you have direct visitors."
        icon="inbox"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Total Direct Visits"
          value={data.totalDirect.toLocaleString()}
        />
        <MetricsCard
          title="Landing Pages"
          value={data.topLandingPages?.length || 0}
        />
        <MetricsCard
          title="Avg. Daily Visits"
          value={data.trend && data.trend.length > 0 
            ? Math.round(data.totalDirect / data.trend.length).toLocaleString()
            : '0'
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

        {/* Direct Traffic Trend Chart */}
        <ChartWrapper title="Direct Traffic Trend">
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
                  formatter={(value) => [value.toLocaleString(), 'Direct Visits']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Direct Visits"
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
    </div>
  );
}
