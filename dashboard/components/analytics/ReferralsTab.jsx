'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import MetricsCard from './MetricsCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ChartWrapper from './ChartWrapper';
import { useToast } from './ToastContainer';
import { getErrorMessage, isAuthError } from '../../utils/errorHandler';

export default function ReferralsTab({ projectId, dateRange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const { showError } = useToast();
  const hasShownErrorRef = useRef(false);

  const fetchReferralsData = useCallback(async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/analytics/referrals?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setData(response.data);
      hasShownErrorRef.current = false;
    } catch (err) {
      console.error('Error fetching referrals data:', err);
      const message = getErrorMessage(err);
      setError(message);
      
      // Show toast notification for errors only once
      if (!isAuthError(err) && !hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        showError(message, {
          onRetry: () => {
            hasShownErrorRef.current = false;
            fetchReferralsData();
          }
        });
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, dateRange, showError]);

  useEffect(() => {
    fetchReferralsData();
  }, [fetchReferralsData]);

  const toggleRowExpansion = (domain) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(domain)) {
      newExpandedRows.delete(domain);
    } else {
      newExpandedRows.add(domain);
    }
    setExpandedRows(newExpandedRows);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading data"
        message={error}
        icon="link"
        actionText="Retry"
        onAction={fetchReferralsData}
      />
    );
  }

  if (!data || data.totalReferrals === 0) {
    return (
      <EmptyState
        title="No referral traffic yet"
        message="Referral traffic from external websites will appear here once visitors arrive from links on other domains."
        icon="link"
      />
    );
  }

  // Sort referrers by visit count descending
  const sortedReferrers = [...(data.topReferrers || [])].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Total Referral Visits"
          value={data.totalReferrals.toLocaleString()}
        />
        <MetricsCard
          title="Referrer Domains"
          value={sortedReferrers.length}
        />
        <MetricsCard
          title="Avg Visits per Domain"
          value={sortedReferrers.length > 0 
            ? Math.round(data.totalReferrals / sortedReferrers.length).toLocaleString()
            : '0'
          }
        />
      </div>

      {/* Referrers List */}
      <ChartWrapper title="Referrer Domains">
        {sortedReferrers.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-6 sm:w-8 px-2 sm:px-4 py-2 sm:py-3"></th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="hidden sm:inline">Referrer Domain</span>
                    <span className="sm:hidden">Domain</span>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReferrers.map((referrer, index) => (
                  <>
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleRowExpansion(referrer.domain)}
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <button
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(referrer.domain);
                          }}
                        >
                          {expandedRows.has(referrer.domain) ? (
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
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 max-w-[150px] sm:max-w-none truncate">
                        <div className="flex items-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="truncate">{referrer.domain}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 text-right font-semibold">
                        {referrer.count.toLocaleString()}
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">
                        {((referrer.count / data.totalReferrals) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    
                    {/* Expandable Details Row */}
                    {expandedRows.has(referrer.domain) && (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 bg-gray-50">
                          <div className="pl-8 space-y-4">
                            {/* Top Referrer URLs */}
                            {referrer.topUrls && referrer.topUrls.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Referrer URLs</h4>
                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Referrer URL
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                          Visits
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {referrer.topUrls.map((urlData, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                          <td className="px-4 py-2 text-xs text-gray-900 max-w-md truncate" title={urlData.url}>
                                            {urlData.url}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 text-right font-semibold">
                                            {urlData.count.toLocaleString()}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Top Landing Pages */}
                            {referrer.topLandingPages && referrer.topLandingPages.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Landing Pages</h4>
                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                          Landing Page
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                          Visits
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {referrer.topLandingPages.map((pageData, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                          <td className="px-4 py-2 text-xs text-gray-900 max-w-md truncate" title={pageData.url}>
                                            {pageData.url}
                                          </td>
                                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 text-right font-semibold">
                                            {pageData.count.toLocaleString()}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Empty state if no details */}
                            {(!referrer.topUrls || referrer.topUrls.length === 0) && 
                             (!referrer.topLandingPages || referrer.topLandingPages.length === 0) && (
                              <p className="text-sm text-gray-500">No detailed information available for this referrer.</p>
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
            No referral traffic found.
          </div>
        )}
      </ChartWrapper>
    </div>
  );
}
