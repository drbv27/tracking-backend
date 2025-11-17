const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    // --- NUEVO CAMPO OBLIGATORIO ---
    apiKey: { 
        type: String, 
        required: true, 
        index: true 
    },

    // --- Campos existentes ---
    eventType: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    
    // Traffic Source Classification
    trafficSource: {
        type: {
            type: String,
            enum: ['organic', 'paid', 'referral', 'direct', 'social'],
            index: true
        },
        platform: {
            type: String,
            index: true
        },
        medium: String
    },
    
    // Platform-specific tracking IDs
    gclid: { type: String, index: true },
    fbclid: { type: String, index: true },
    ttclid: String,
    li_fat_id: String,
    
    // UTM Parameters
    utm_source: { type: String, index: true },
    utm_medium: { type: String },
    utm_campaign: { type: String },
    utm_term: { type: String },
    utm_content: { type: String },
    
    // Referrer Information
    referrer: String,
    referrerDomain: { type: String, index: true },
    
    // Page Information
    pageUrl: { type: String },
    clickedUrl: { type: String },
    buttonId: { type: String },
    buttonHref: { type: String }
});

// Compound indexes for common query patterns
eventSchema.index({ apiKey: 1, timestamp: -1 });
eventSchema.index({ apiKey: 1, 'trafficSource.type': 1 });

module.exports = mongoose.model('Event', eventSchema);