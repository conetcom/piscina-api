const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/usuariosModel');

exports.registrarUsuario = async (req, res) => {
    try {
        const { username, email, password, rol } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await usuariosModel.getUsuarioByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado',
            });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario en la base de datos
        const newUser = await usuariosModel.createUsuario(username, email, hashedPassword, rol);

        // Verificar que el usuario se haya creado correctamente
        if (!newUser || !newUser.id) {
            throw new Error('Error al crear el usuario en la base de datos');
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email},
            process.env.JWT_SECRET, // Clave secreta desde variables de entorno
            { expiresIn: '1h' } // Expiración del token
        );

        // Respuesta exitosa con el usuario registrado y el token
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: {
                    id: newUser.id,
                    name: newUser.username,
                    email: newUser.email,
                    rol: newUser.rol,
                },
                token: token,
            },
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario',
            error: error.message,
        });
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
          name: user.username,
          email: user.email,
          rol: user.rol,
        },
        token: token,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

