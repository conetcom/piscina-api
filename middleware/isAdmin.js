// isAdmin.js
const isAdmin = (req, res, next) => {
    const usuario = req.usuario;
    if (!usuario || usuario.role !== 'admin') {
        return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
};

module.exports = isAdmin;
