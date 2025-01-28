const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
<<<<<<< HEAD
    const token = req.header('Authorization');
=======
   const token = req.header('Authorization');
>>>>>>> 312ac85780e5b1e20a54d51920c94b3321b074b0
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
