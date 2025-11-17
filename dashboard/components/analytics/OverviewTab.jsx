'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MetricsCard from './MetricsCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ChartWrapper from './ChartWrapper';
import { useToast } from './ToastContainer';
import { getErrorMessage, isAuthError } from '../../utils/errorHandler';

const COLORS = {
  organic: '#10b981',
  paid: '#3b82f6',
  referral: '#f59e0b',
  direct: '#6366f1',
  social: '#ec4899'
};

export default function OverviewTab({ projectId, dateRange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useToast();
  const hasShownErrorRef = useRef(false);

  const fetchOverviewData = useCallback(async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/analytics/overview?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setData(response.data);
      hasShownErrorRef.current = false;
    } catch (err) {
      console.error('Error fetching overview data:', err);
      const message = getErrorMessage(err);
      setError(message);
      
      // Show toast notification for errors only once
      if (!isAuthError(err) && !hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        showError(message, {
          onRetry: () => {
            hasShownErrorRef.current = false;
            fetchOverviewData();
          }
        });
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, dateRange, showError]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading data"
        message={error}
        icon="chart"
        actionText="Retry"
        onAction={fetchOverviewData}
      />
    );
  }

  if (!data || data.totalEvents === 0) {
    return (
      <EmptyState
        title="No tracking data yet"
        message="Start tracking events on your website to see analytics here."
        icon="chart"
      />
    );
  }

  // Prepare data for pie chart
  const trafficBreakdownData = Object.entries(data.trafficBreakdown || {})
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      percentage: ((count / data.totalEvents) * 100).toFixed(1)
    }));

  // Calculate unique sources count
  const uniqueSources = data.topSources?.length || 0;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Total Visits"
          value={data.totalEvents.toLocaleString()}
        />
        <MetricsCard
          title="Unique Sources"
          value={uniqueSources}
        />
        <MetricsCard
          title="Traffic Types"
          value={trafficBreakdownData.length}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Traffic Source Breakdown - Pie Chart */}
        <ChartWrapper title="Traffic Source Breakdown">
          {trafficBreakdownData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={trafficBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  className="sm:outerRadius-[80px]"
                >
                  {trafficBreakdownData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name.toLowerCase()] || '#94a3b8'} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => value.toLocaleString()}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm">
              No traffic data available
            </div>
          )}
        </ChartWrapper>

        {/* Top 5 Sources Table */}
        <ChartWrapper title="Top 5 Sources">
          {data.topSources && data.topSources.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visits
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.topSources.slice(0, 5).map((source, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {source.platform || 'Unknown'}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <span 
                          className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${COLORS[source.type] || '#94a3b8'}20`,
                            color: COLORS[source.type] || '#64748b'
                          }}
                        >
                          {source.type}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right font-semibold">
                        {source.count.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm">
              No source data available
            </div>
          )}
        </ChartWrapper>
      </div>

      {/* Traffic Trend Line Chart */}
      <ChartWrapper title="Traffic Trend">
        {data.dailyTrend && data.dailyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <LineChart data={data.dailyTrend}>
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
                formatter={(value) => [value.toLocaleString(), 'Visits']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
                name="Visits"
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
