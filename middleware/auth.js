const jwt = require('jsonwebtoken');
require('dotenv').config();

// Este es nuestro "guardia"
module.exports = function(req, res, next) {
    // 1. Obtener el token del header de la petición
    // Soportamos tanto 'x-auth-token' como 'Authorization' (Bearer token)
    let token = req.header('x-auth-token');
    
    // Si no hay x-auth-token, intentamos con Authorization header
    if (!token) {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Removemos 'Bearer ' del inicio
        }
    }

    // 2. Si no hay token, rechazamos
    if (!token) {
        return res.status(401).json({ message: 'No hay token, permiso denegado' });
    }

    // 3. Si hay token, intentamos verificarlo
    try {
        // Decodificamos el token usando nuestro secreto
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Si es válido, extraemos el payload (que tiene el user.id)
        // y lo adjuntamos al objeto 'req' para que las siguientes
        // rutas lo puedan usar.
        req.user = decoded.user;
        
        // Damos paso a la siguiente función (la ruta)
        next();
    } catch (err) {
        // Si el token no es válido (ej. expiró)
        res.status(401).json({ message: 'Token no es válido' });
    }
};