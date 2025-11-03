const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // <-- Importamos nuestro "guardia"
const Project = require('../models/Project'); // Importamos el modelo Project
const User = require('../models/User'); // (Opcional, para validación futura)

// --- Ruta para OBTENER todos los proyectos de un usuario ---
// @ruta    GET /api/projects
// @desc    Obtener todos los proyectos del usuario autenticado
// @acceso  Privado (necesita token)
router.get('/', auth, async (req, res) => {
    try {
        // Gracias al middleware 'auth', tenemos 'req.user.id'.
        // Buscamos en la BD todos los proyectos donde el campo 'user'
        // coincida con el ID del usuario en el token.
        const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        res.json(projects);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// --- Ruta para CREAR un nuevo proyecto ---
// @ruta    POST /api/projects
// @desc    Crear un nuevo proyecto
// @acceso  Privado (necesita token)
router.post('/', auth, async (req, res) => {
    const { name } = req.body;

    // Validación simple
    if (!name) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }

    try {
        // Creamos la instancia del nuevo proyecto
        const newProject = new Project({
            name,
            user: req.user.id // Asignamos el proyecto al usuario del token
            // La apiKey se genera automáticamente gracias a 'default'
            // en el modelo que creamos antes.
        });

        // Guardamos el proyecto en la BD
        const project = await newProject.save();

        // Devolvemos el proyecto recién creado (incluyendo su apiKey)
        res.status(201).json(project);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;