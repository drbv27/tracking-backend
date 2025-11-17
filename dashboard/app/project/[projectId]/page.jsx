"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import TabNavigation from '../../../components/analytics/TabNavigation';
import DateRangePicker from '../../../components/analytics/DateRangePicker';
import OverviewTab from '../../../components/analytics/OverviewTab';
import OrganicTab from '../../../components/analytics/OrganicTab';
import CampaignsTab from '../../../components/analytics/CampaignsTab';
import ReferralsTab from '../../../components/analytics/ReferralsTab';
import DirectTab from '../../../components/analytics/DirectTab';
import InstallationGuide from '../../../components/analytics/InstallationGuide';
import ErrorBoundary from '../../../components/analytics/ErrorBoundary';
import { ToastProvider, useToast } from '../../../components/analytics/ToastContainer';
import { getErrorMessage } from '../../../utils/errorHandler';

function ProjectAnalyticsPageContent() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { projectId } = params;
    const { showError, showWarning } = useToast();

    // State management for active tab and date range
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0],
            days: 30
        };
    });

    // State for event counts per tab
    const [eventCounts, setEventCounts] = useState({
        total: 0,
        organic: 0,
        paid: 0,
        referral: 0,
        direct: 0
    });
    const [countsLoading, setCountsLoading] = useState(true);
    const [projectData, setProjectData] = useState(null);

    // Tab configuration with event counts
    const tabs = [
        { id: 'overview', label: 'Overview', count: eventCounts.total },
        { id: 'organic', label: 'Organic', count: eventCounts.organic },
        { id: 'campaigns', label: 'Paid Campaigns', count: eventCounts.paid },
        { id: 'referrals', label: 'Referrals', count: eventCounts.referral },
        { id: 'direct', label: 'Direct', count: eventCounts.direct }
    ];

    // Authentication guard
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    // Fetch project data
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!isAuthenticated || !projectId) return;
            
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                
                const response = await fetch(
                    `${apiUrl}/projects/${projectId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    setProjectData(data);
                } else if (response.status === 401 || response.status === 403) {
                    showError('You do not have permission to access this project.');
                    router.push('/dashboard');
                } else if (response.status === 404) {
                    showError('Project not found.');
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Error fetching project data:', error);
                const message = getErrorMessage(error);
                showWarning(message);
            }
        };
        
        fetchProjectData();
    }, [projectId, isAuthenticated, router, showError, showWarning]);

    // Fetch event counts when date range changes
    useEffect(() => {
        const fetchEventCounts = async () => {
            if (!isAuthenticated || !projectId) return;
            
            setCountsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                
                const response = await fetch(
                    `${apiUrl}/projects/${projectId}/analytics/counts?startDate=${dateRange.start}&endDate=${dateRange.end}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    setEventCounts(data);
                } else {
                    console.error('Failed to fetch event counts');
                    // Graceful degradation - keep showing zeros
                    setEventCounts({
                        total: 0,
                        organic: 0,
                        paid: 0,
                        referral: 0,
                        direct: 0
                    });
                }
            } catch (error) {
                console.error('Error fetching event counts:', error);
                // Graceful degradation - keep showing zeros
                setEventCounts({
                    total: 0,
                    organic: 0,
                    paid: 0,
                    referral: 0,
                    direct: 0
                });
            } finally {
                setCountsLoading(false);
            }
        };
        
        fetchEventCounts();
    }, [projectId, dateRange.start, dateRange.end, isAuthenticated]);

    // Handle date range changes
    const handleDateRangeChange = (newRange) => {
        setDateRange({
            start: newRange.startDate,
            end: newRange.endDate,
            days: newRange.days
        });
    };

    // Render loading state
    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-700">Verificando autenticación...</p>
            </main>
        );
    }

    // Conditionally render tab content based on active tab
    const renderTabContent = () => {
        const tabProps = {
            projectId,
            dateRange: { start: dateRange.start, end: dateRange.end }
        };

        switch (activeTab) {
            case 'overview':
                return (
                    <ErrorBoundary key="overview" onReset={() => setActiveTab('overview')}>
                        <OverviewTab {...tabProps} />
                    </ErrorBoundary>
                );
            case 'organic':
                return (
                    <ErrorBoundary key="organic" onReset={() => setActiveTab('organic')}>
                        <OrganicTab {...tabProps} />
                    </ErrorBoundary>
                );
            case 'campaigns':
                return (
                    <ErrorBoundary key="campaigns" onReset={() => setActiveTab('campaigns')}>
                        <CampaignsTab {...tabProps} />
                    </ErrorBoundary>
                );
            case 'referrals':
                return (
                    <ErrorBoundary key="referrals" onReset={() => setActiveTab('referrals')}>
                        <ReferralsTab {...tabProps} />
                    </ErrorBoundary>
                );
            case 'direct':
                return (
                    <ErrorBoundary key="direct" onReset={() => setActiveTab('direct')}>
                        <DirectTab {...tabProps} />
                    </ErrorBoundary>
                );
            default:
                return (
                    <ErrorBoundary key="overview" onReset={() => setActiveTab('overview')}>
                        <OverviewTab {...tabProps} />
                    </ErrorBoundary>
                );
        }
    };

    return isAuthenticated ? (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="font-bold text-xl text-blue-600">Metrics Lab</span>
                        </div>
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                                ← Volver al Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                {/* Analytics Header with Project Name and Date Range Picker */}
                <div className="bg-white rounded-lg shadow mb-4 sm:mb-6">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                                        {projectData?.name || 'Project Analytics'}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        Comprehensive traffic source analysis and insights
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                                    <InstallationGuide 
                                        projectId={projectId}
                                        apiKey={projectData?.apiKey}
                                    />
                                    <DateRangePicker 
                                        value={dateRange} 
                                        onChange={handleDateRangeChange} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <TabNavigation 
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    ) : null;
}

// Wrap the entire page with ToastProvider
export default function ProjectAnalyticsPage() {
    return (
        <ToastProvider>
            <ProjectAnalyticsPageContent />
        </ToastProvider>
    );
}