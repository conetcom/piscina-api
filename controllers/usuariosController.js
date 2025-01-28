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
    const usuario = await usuariosModel.getUsuarioByEmail(email);

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};
