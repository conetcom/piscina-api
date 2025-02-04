const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/usuariosModel');

exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        if (!rol) {
            rol = 'cliente';
        }

        // Verificar si el correo electrónico ya está registrado
        const user = await usuariosModel.getUsuarioByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario
        const newUser = await usuariosModel.createUsuario(nombre, email, hashedPassword, rol);
        
        res.status(201).jsonres.json({
            success: true,
            message: "Login exitoso",
            data: {
              user: {
                id: user.id,
                name: user.nombre,
                email: user.email,
                //role: user.role,
              },
              token: token,
            },
          });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({  success: false,
            message: "Registro Fallido",
            data: {
              user: {
                id: user.id,
                name: user.nombre,
                email: user.email,
                //role: user.role,
              },
              token: token,
            }, });
    }
};

exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    const user = await usuariosModel.getUsuarioByEmail(email);

    if (!user) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Generar JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        user: {
          id: user.id,
          name: user.nombre,
          email: user.email,
          //role: user.role,
        },
        token: token,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

/*
exports.loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    const user = await usuariosModel.getUsuarioByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user });
};
*/