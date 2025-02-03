const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/usuariosModel');

exports.registrarUsuario = async (req, res) => {
    const { id, nombre, email, password } = req.body;
    //console.log('req.body');
    const hashedPassword = await bcrypt.hash(password, 10);
    await usuariosModel.createUsuario(id, nombre, email, hashedPassword);
    res.status(201).json({ mensaje: 'Usuario registrado' });
};

exports.loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    const user = await usuariosModel.getUsuarioByEmail(email);

    if (!user || !(await bcrypt.compare(password, usuario.password))) {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user });
};
