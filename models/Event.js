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
    gclid: { type: String, index: true },
    utm_source: { type: String, index: true },
    utm_medium: { type: String },
    utm_campaign: { type: String },
    utm_term: { type: String },
    utm_content: { type: String },
    pageUrl: { type: String },
    clickedUrl: { type: String },
    buttonId: { type: String },
    buttonHref: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);