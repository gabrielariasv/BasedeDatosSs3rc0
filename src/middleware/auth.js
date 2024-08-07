const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (requiredPermission) => (req, res, next) => {
    // Log para verificar la llegada del token en el encabezado
    console.log('Authorization Header:', req.header('Authorization'));
    
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extrae el token eliminando el prefijo 'Bearer '
    
    if (!token) {
        console.log('No token provided.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Decodifica el token
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log('Decoded Token:', decoded); // Log para verificar el contenido del token decodificado
        req.user = decoded;

        // Verifica los permisos
        if (decoded.permission < requiredPermission) {
            console.log('Insufficient permissions. User permission:', decoded.permission);
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        // Continúa con la siguiente función en la cadena de middleware
        next();
    } catch (err) {
        console.log('Token verification error:', err.message); // Log del error de verificación
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
