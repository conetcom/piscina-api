const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });

    try {
        const verificado = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.usuario = verificado;
        next();
    } catch (err) {
        res.status(400).json({ mensaje: 'Token no válido' });
    }
};

module.exports = authMiddleware;
