const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importamos el modelo

const router = express.Router();

// --- Ruta de Registro ---
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar si el email ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // 2. Crear nuevo usuario
        user = new User({
            email,
            password
        });

        // 3. Encriptar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Guardar usuario en la BD
        await user.save();

        // 5. Crear y devolver un token (JWT)
        const payload = {
            user: {
                id: user.id // El id que MongoDB le asigna
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Necesitaremos esta variable de entorno
            { expiresIn: '7d' }, // Token válido por 7 días
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token }); // 201 = Creado
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// --- Ruta de Login ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña ingresada con la guardada (hasheada)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // 3. Si todo coincide, crear y devolver un token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;