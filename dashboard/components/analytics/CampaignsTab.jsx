'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import MetricsCard from './MetricsCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ChartWrapper from './ChartWrapper';
import { useToast } from './ToastContainer';
import { getErrorMessage, isAuthError } from '../../utils/errorHandler';

const PLATFORM_COLORS = {
  google: '#4285f4',
  facebook: '#1877f2',
  instagram: '#e4405f',
  youtube: '#ff0000',
  tiktok: '#000000',
  linkedin: '#0077b5',
  twitter: '#1da1f2'
};

export default function CampaignsTab({ projectId, dateRange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'visits', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [campaignDetails, setCampaignDetails] = useState({});
  const { showError } = useToast();
  const hasShownErrorRef = useRef(false);

  const fetchCampaignsData = useCallback(async () => {
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
      if (selectedPlatform !== 'all') {
        params.append('platform', selectedPlatform);
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/analytics/campaigns?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setData(response.data);
      hasShownErrorRef.current = false;
    } catch (err) {
      console.error('Error fetching campaigns data:', err);
      const message = getErrorMessage(err);
      setError(message);
      
      // Show toast notification for errors only once
      if (!isAuthError(err) && !hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        showError(message, {
          onRetry: () => {
            hasShownErrorRef.current = false;
            fetchCampaignsData();
          }
        });
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, dateRange, selectedPlatform]);

  useEffect(() => {
    fetchCampaignsData();
  }, [fetchCampaignsData]);

  const fetchCampaignDetails = useCallback(async (campaignName) => {
    if (campaignDetails[campaignName]) {
      return; // Already fetched
    }

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (dateRange?.start) {
        params.append('startDate', dateRange.start);
      }
      if (dateRange?.end) {
        params.append('endDate', dateRange.end);
      }
      params.append('campaign', campaignName);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/analytics/campaigns/details?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCampaignDetails(prev => ({
        ...prev,
        [campaignName]: response.data.events || []
      }));
    } catch (err) {
      console.error('Error fetching campaign details:', err);
      const message = getErrorMessage(err);
      
      // Show error in campaign details area
      setCampaignDetails(prev => ({
        ...prev,
        [campaignName]: []
      }));
      
      // Don't show toast for campaign details errors to avoid spam
    }
  }, [projectId, dateRange, campaignDetails]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const toggleRowExpansion = (campaignName) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(campaignName)) {
      newExpandedRows.delete(campaignName);
    } else {
      newExpandedRows.add(campaignName);
      fetchCampaignDetails(campaignName);
    }
    setExpandedRows(newExpandedRows);
  };

  const getSortedCampaigns = () => {
    if (!data?.campaigns) return [];
    
    const sorted = [...data.campaigns].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle string comparisons
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  };

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
        onAction={fetchCampaignsData}
      />
    );
  }

  if (!data || data.totalCampaigns === 0) {
    return (
      <EmptyState
        title="No paid campaigns yet"
        message="Paid campaign traffic from Google Ads, Facebook Ads, and other platforms will appear here once visitors arrive with campaign parameters."
        icon="chart"
      />
    );
  }

  const sortedCampaigns = getSortedCampaigns();
  const platforms = ['all', 'google', 'facebook', 'instagram', 'youtube', 'tiktok', 'linkedin'];

  // Calculate total visits and clicks
  const totalVisits = data.campaigns?.reduce((sum, c) => sum + c.visits, 0) || 0;
  const totalClicks = data.campaigns?.reduce((sum, c) => sum + (c.clicks || 0), 0) || 0;

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <MetricsCard
          title="Total Campaigns"
          value={data.totalCampaigns}
        />
        <MetricsCard
          title="Total Visits"
          value={totalVisits.toLocaleString()}
        />
        <MetricsCard
          title="Total Clicks"
          value={totalClicks.toLocaleString()}
        />
        <MetricsCard
          title="Platforms"
          value={Object.keys(data.byPlatform || {}).length}
        />
      </div>

      {/* Platform Breakdown Summary Cards */}
      {data.byPlatform && Object.keys(data.byPlatform).length > 0 && (
        <ChartWrapper title="Platform Breakdown">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {Object.entries(data.byPlatform).map(([platform, count]) => (
              <div 
                key={platform}
                className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg"
              >
                <div 
                  className="w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: PLATFORM_COLORS[platform.toLowerCase()] || '#94a3b8' }}
                ></div>
                <span className="text-xs text-gray-500 capitalize mb-1 text-center">{platform}</span>
                <span className="text-base sm:text-lg font-semibold text-gray-900">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </ChartWrapper>
      )}

      {/* Platform Filter and Campaigns Table */}
      <ChartWrapper title="Campaigns">
        {/* Platform Filter Dropdown */}
        <div className="mb-4">
          <label htmlFor="platform-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Filter by Platform
          </label>
          <select
            id="platform-filter"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
          >
            {platforms.map(platform => (
              <option key={platform} value={platform}>
                {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Campaigns Table */}
        {sortedCampaigns.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-6 sm:w-8 px-2 sm:px-4 py-2 sm:py-3"></th>
                  <th 
                    className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <span className="hidden sm:inline">Campaign Name</span>
                      <span className="sm:hidden">Campaign</span>
                      <SortIcon columnKey="name" />
                    </div>
                  </th>
                  <th 
                    className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('platform')}
                  >
                    <div className="flex items-center">
                      Platform
                      <SortIcon columnKey="platform" />
                    </div>
                  </th>
                  <th 
                    className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('medium')}
                  >
                    <div className="flex items-center">
                      Medium
                      <SortIcon columnKey="medium" />
                    </div>
                  </th>
                  <th 
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('visits')}
                  >
                    <div className="flex items-center justify-end">
                      Visits
                      <SortIcon columnKey="visits" />
                    </div>
                  </th>
                  <th 
                    className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('clicks')}
                  >
                    <div className="flex items-center justify-end">
                      Clicks
                      <SortIcon columnKey="clicks" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCampaigns.map((campaign, index) => (
                  <>
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleRowExpansion(campaign.name)}
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <button
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(campaign.name);
                          }}
                        >
                          {expandedRows.has(campaign.name) ? (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 max-w-[120px] sm:max-w-none truncate">
                        {campaign.name || 'Unnamed Campaign'}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <span 
                          className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                          style={{ 
                            backgroundColor: `${PLATFORM_COLORS[campaign.platform?.toLowerCase()] || '#94a3b8'}20`,
                            color: PLATFORM_COLORS[campaign.platform?.toLowerCase()] || '#64748b'
                          }}
                        >
                          {campaign.platform || 'Unknown'}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {campaign.medium || '-'}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right font-semibold">
                        {campaign.visits.toLocaleString()}
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right font-semibold">
                        {(campaign.clicks || 0).toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* Expandable Details Row */}
                    {expandedRows.has(campaign.name) && (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 bg-gray-50">
                          <div className="pl-8">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Campaign Events</h4>
                            {campaignDetails[campaign.name] ? (
                              campaignDetails[campaign.name].length > 0 ? (
                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Timestamp
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Event Type
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Page URL
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {campaignDetails[campaign.name].slice(0, 10).map((event, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                                            {new Date(event.timestamp).toLocaleString()}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                            {event.eventType}
                                          </td>
                                          <td className="px-4 py-2 text-xs text-gray-600 max-w-md truncate" title={event.pageUrl}>
                                            {event.pageUrl}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  {campaignDetails[campaign.name].length > 10 && (
                                    <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 text-center">
                                      Showing 10 of {campaignDetails[campaign.name].length} events
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No events found for this campaign.</p>
                              )
                            ) : (
                              <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-sm text-gray-500">Loading events...</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No campaigns found for the selected platform.
          </div>
        )}
      </ChartWrapper>
    </div>
  );
}
