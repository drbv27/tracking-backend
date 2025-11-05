const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importamos nuestro "guardia"
const Project = require('../models/Project'); // <-- ¡Ahora lo usamos!
const Event = require('../models/Event'); // <-- ¡NUEVO!

// --- Ruta para OBTENER todos los proyectos de un usuario ---
// (Esta ya la tenías)
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// --- Ruta para CREAR un nuevo proyecto ---
// (Esta ya la tenías)
router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }
    try {
        const newProject = new Project({
            name,
            user: req.user.id
        });
        const project = await newProject.save();
        res.status(201).json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// --- ¡NUEVA RUTA! ---
// --- Ruta para OBTENER eventos de un proyecto específico ---
// @ruta    GET /api/projects/:projectId/events
// @desc    Obtener todos los eventos de un proyecto específico
// @acceso  Privado
router.get('/:projectId/events', auth, async (req, res) => {
    try {
        // 1. Encontrar el proyecto por su ID
        const project = await Project.findById(req.params.projectId);

        // 2. Verificar que el proyecto exista
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // 3. ¡Control de Seguridad CRÍTICO!
        // Verificar que el proyecto le pertenezca al usuario que está logueado.
        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        // 4. Si todo está en orden, buscar los eventos usando la apiKey del proyecto
        const events = await Event.find({ apiKey: project.apiKey })
            .sort({ timestamp: -1 }) // Ordenar por más reciente
            .limit(200); // Limitar a los últimos 200 eventos (para no sobrecargar)

        res.json(events);

    } catch (err) {
        // Manejo de error para IDs inválidos de MongoDB
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});


module.exports = router;