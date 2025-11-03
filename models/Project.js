const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Para generar la apiKey

const projectSchema = new mongoose.Schema({
    // Vínculo con el usuario que creó el proyecto
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    // La API Key única
    apiKey: {
        type: String,
        required: true,
        unique: true,
        default: () => `key_${uuidv4()}` // Genera una API Key única
    },
    // Para el futuro: aquí podríamos listar los dominios
    // permitidos para esta API key.
    allowedDomains: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);