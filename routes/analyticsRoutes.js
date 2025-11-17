const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :projectId from parent route
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Event = require('../models/Event');

// Helper function to verify project ownership
async function verifyProjectOwnership(projectId, userId) {
    const project = await Project.findById(projectId);
    
    if (!project) {
        return { error: 'Proyecto no encontrado', status: 404 };
    }
    
    if (project.user.toString() !== userId) {
        return { error: 'No autorizado', status: 401 };
    }
    
    return { project };
}

// Helper function to parse date range from query parameters
function getDateRange(req) {
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const startDate = req.query.startDate 
        ? new Date(req.query.startDate) 
        : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    
    return { startDate, endDate };
}

// GET /api/projects/:projectId/analytics/counts
// Returns event counts for each traffic type (for tab labels)
router.get('/counts', auth, async (req, res) => {
    try {
        const { project, error, status } = await verifyProjectOwnership(req.params.projectId, req.user.id);
        if (error) {
            return res.status(status).json({ message: error });
        }
        
        const { startDate, endDate } = getDateRange(req);
        
        // Query events within date range
        const matchStage = {
            apiKey: project.apiKey,
            timestamp: { $gte: startDate, $lte: endDate }
        };
        
        // Get total events count
        const totalEvents = await Event.countDocuments(matchStage);
        
        // Aggregate counts by trafficSource.type
        const trafficCounts = await Event.aggregate([
            { $match: matchStage },
            { 
                $group: {
                    _id: '$trafficSource.type',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Convert to object format with default values
        const counts = {
            total: totalEvents,
            organic: 0,
            paid: 0,
            referral: 0,
            direct: 0,
            social: 0
        };
        
        trafficCounts.forEach(item => {
            if (item._id) {
                counts[item._id] = item.count;
            }
        });
        
        res.json(counts);
        
    } catch (err) {
        console.error('Error in /counts:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// GET /api/projects/:projectId/analytics/overview
// Returns aggregated overview data for the project
router.get('/overview', auth, async (req, res) => {
    try {
        const { project, error, status } = await verifyProjectOwnership(req.params.projectId, req.user.id);
        if (error) {
            return res.status(status).json({ message: error });
        }
        
        const { startDate, endDate } = getDateRange(req);
        
        // Query events within date range
        const matchStage = {
            apiKey: project.apiKey,
            timestamp: { $gte: startDate, $lte: endDate }
        };
        
        // Get total events count
        const totalEvents = await Event.countDocuments(matchStage);
        
        // Aggregate traffic breakdown by trafficSource.type
        const trafficBreakdown = await Event.aggregate([
            { $match: matchStage },
            { 
                $group: {
                    _id: '$trafficSource.type',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Convert to object format
        const breakdown = {};
        trafficBreakdown.forEach(item => {
            if (item._id) {
                breakdown[item._id] = item.count;
            }
        });
        
        // Calculate top sources by platform with counts
        const topSources = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        platform: '$trafficSource.platform',
                        type: '$trafficSource.type'
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 0,
                    platform: '$_id.platform',
                    type: '$_id.type',
                    count: 1
                }
            }
        ]);
        
        // Generate daily trend data
        const dailyTrend = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1
                }
            }
        ]);
        
        res.json({
            totalEvents,
            dateRange: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0]
            },
            trafficBreakdown: breakdown,
            topSources,
            dailyTrend
        });
        
    } catch (err) {
        console.error('Error in /overview:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// GET /api/projects/:projectId/analytics/organic
// Returns organic traffic data grouped by search engine and landing page
router.get('/organic', auth, async (req, res) => {
    try {
        const { project, error, status } = await verifyProjectOwnership(req.params.projectId, req.user.id);
        if (error) {
            return res.status(status).json({ message: error });
        }
        
        const { startDate, endDate } = getDateRange(req);
        
        // Filter events where trafficSource.type = 'organic'
        const matchStage = {
            apiKey: project.apiKey,
            'trafficSource.type': 'organic',
            timestamp: { $gte: startDate, $lte: endDate }
        };
        
        // Get total organic count
        const totalOrganic = await Event.countDocuments(matchStage);
        
        // Group by trafficSource.platform (search engine) with counts and percentages
        const bySearchEngine = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$trafficSource.platform',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            {
                $project: {
                    _id: 0,
                    engine: '$_id',
                    count: 1,
                    percentage: {
                        $multiply: [
                            { $divide: ['$count', totalOrganic || 1] },
                            100
                        ]
                    }
                }
            }
        ]);
        
        // Aggregate top landing pages with visit counts
        const topLandingPages = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$pageUrl',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    url: '$_id',
                    count: 1
                }
            }
        ]);
        
        // Generate organic traffic trend over time
        const trend = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1
                }
            }
        ]);
        
        res.json({
            totalOrganic,
            bySearchEngine,
            topLandingPages,
            trend
        });
        
    } catch (err) {
        console.error('Error in /organic:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// GET /api/projects/:projectId/analytics/campaigns
// Returns paid campaign data with performance metrics
router.get('/campaigns', auth, async (req, res) => {
    try {
        const { project, error, status } = await verifyProjectOwnership(req.params.projectId, req.user.id);
        if (error) {
            return res.status(status).json({ message: error });
        }
        
        const { startDate, endDate } = getDateRange(req);
        const platformFilter = req.query.platform;
        
        // Filter events where trafficSource.type = 'paid'
        const matchStage = {
            apiKey: project.apiKey,
            'trafficSource.type': 'paid',
            timestamp: { $gte: startDate, $lte: endDate }
        };
        
        // Support platform filtering via query parameter
        if (platformFilter) {
            matchStage['trafficSource.platform'] = platformFilter;
        }
        
        // Group by utm_campaign with aggregated metrics
        const campaigns = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$utm_campaign',
                    visits: { $sum: 1 },
                    clicks: {
                        $sum: {
                            $cond: [{ $ne: ['$clickedUrl', null] }, 1, 0]
                        }
                    },
                    platforms: { $addToSet: '$trafficSource.platform' },
                    mediums: { $addToSet: '$trafficSource.medium' },
                    lastSeen: { $max: '$timestamp' }
                }
            },
            { $sort: { visits: -1 } },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    visits: 1,
                    clicks: 1,
                    platform: { $arrayElemAt: ['$platforms', 0] },
                    medium: { $arrayElemAt: ['$mediums', 0] },
                    uniqueSources: { $size: '$platforms' },
                    lastSeen: 1
                }
            }
        ]);
        
        // Calculate byPlatform breakdown
        const byPlatform = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$trafficSource.platform',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const platformBreakdown = {};
        byPlatform.forEach(item => {
            if (item._id) {
                platformBreakdown[item._id] = item.count;
            }
        });
        
        res.json({
            totalCampaigns: campaigns.length,
            campaigns,
            byPlatform: platformBreakdown
        });
        
    } catch (err) {
        console.error('Error in /campaigns:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// GET /api/projects/:projectId/analytics/campaigns/details
// Returns detailed event list for a specific campaign
router.get('/campaigns/details', auth, async (req, res) => {
    try {
        const { project, error, status } = await verifyProjectOwnership(req.params.projectId, req.user.id);
        if (error) {
            return res.status(status).json({ message: error });
        }
        
        const { startDate, endDate } = getDateRange(req);
        const campaignName = req.query.campaign;
        
        if (!campaignName) {
            return res.status(400).json({ message: 'Campaign name is required' });
        }
        
        // Filter events for the specific campaign
        const matchStage = {
            apiKey: project.apiKey,
            'trafficSource.type': 'paid',
            utm_campaign: campaignName,
            timestamp: { $gte: startDate, $lte: endDate }
        };
        
        // Get events with relevant fields
        const events = await Event.find(matchStage)
            .select('timestamp eventType pageUrl clickedUrl trafficSource utm_source utm_medium')
            .sort({ timestamp: -1 })
            .limit(100);
        
        res.json({
            campaign: campaignName,
            totalEvents: events.length,
            events
        });
        
    } catch (err) {
        console.error('Error in /campaigns/details:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// GET /api/projects/:projectId/analytics/referrals
// Returns referral traffic data grouped by domain
router.get('/referrals', auth, async (req, res) => {
    try {
        const { project, error, status } = await verifyProjectOwnership(req.params.projectId, req.user.id);
        if (error) {
            return res.status(status).json({ message: error });
        }
        
        const { startDate, endDate } = getDateRange(req);
        
        // Filter events where trafficSource.type = 'referral'
        const matchStage = {
            apiKey: project.apiKey,
            'trafficSource.type': 'referral',
            timestamp: { $gte: startDate, $lte: endDate }
        };
        
        // Get total referrals count
        const totalReferrals = await Event.countDocuments(matchStage);
        
        // Group by referrerDomain with counts
        const topReferrers = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$referrerDomain',
                    count: { $sum: 1 },
                    referrerUrls: { $addToSet: '$referrer' },
                    landingPages: { $addToSet: '$pageUrl' }
                }
            },
            { $sort: { count: -1 } },
            {
                $project: {
                    _id: 0,
                    domain: '$_id',
                    count: 1,
                    topUrls: { $slice: ['$referrerUrls', 5] },
                    topLandingPages: { $slice: ['$landingPages', 5] }
                }
            }
        ]);
        
        // For each domain, get detailed URL counts
        const detailedReferrers = await Promise.all(
            topReferrers.slice(0, 10).map(async (referrer) => {
                const urlCounts = await Event.aggregate([
                    {
                        $match: {
                            ...matchStage,
                            referrerDomain: referrer.domain
                        }
                    },
                    {
                        $group: {
                            _id: '$referrer',
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } },
                    { $limit: 5 },
                    {
                        $project: {
                            _id: 0,
                            url: '$_id',
                            count: 1
                        }
                    }
                ]);
                
                const landingPageCounts = await Event.aggregate([
                    {
                        $match: {
                            ...matchStage,
                            referrerDomain: referrer.domain
                        }
                    },
                    {
                        $group: {
                            _id: '$pageUrl',
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { count: -1 } },
                    { $limit: 5 },
                    {
                        $project: {
                            _id: 0,
                            url: '$_id',
                            count: 1
                        }
                    }
                ]);
                
                return {
                    domain: referrer.domain,
                    count: referrer.count,
                    topUrls: urlCounts,
                    topLandingPages: landingPageCounts
                };
            })
        );
        
        res.json({
            totalReferrals,
            topReferrers: detailedReferrers
        });
        
    } catch (err) {
        console.error('Error in /referrals:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// GET /api/projects/:projectId/analytics/direct
// Returns direct traffic data
router.get('/direct', auth, async (req, res) => {
    try {
        const { project, error, status } = await verifyProjectOwnership(req.params.projectId, req.user.id);
        if (error) {
            return res.status(status).json({ message: error });
        }
        
        const { startDate, endDate } = getDateRange(req);
        
        // Filter events where trafficSource.type = 'direct'
        const matchStage = {
            apiKey: project.apiKey,
            'trafficSource.type': 'direct',
            timestamp: { $gte: startDate, $lte: endDate }
        };
        
        // Get total direct count
        const totalDirect = await Event.countDocuments(matchStage);
        
        // Aggregate top landing pages with counts
        const topLandingPages = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$pageUrl',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    url: '$_id',
                    count: 1
                }
            }
        ]);
        
        // Generate direct traffic trend over time
        const trend = await Event.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1
                }
            }
        ]);
        
        res.json({
            totalDirect,
            topLandingPages,
            trend
        });
        
    } catch (err) {
        console.error('Error in /direct:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

module.exports = router;
