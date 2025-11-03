const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Cada email debe ser único
        lowercase: true, // Guarda el email en minúsculas
        trim: true // Quita espacios al inicio y fin
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Mínimo 6 caracteres
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);