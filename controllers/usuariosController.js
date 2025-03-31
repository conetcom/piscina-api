const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosModel  = require('../models/usuariosModel');


registrarUsuario = async (req, res) => {
    try {
        const { username, lastname, email, password, rol } = req.body;

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
        const newUser = await usuariosModel.createUsuario(username, lastname, email, hashedPassword, rol);

        // Verificar que el usuario se haya creado correctamente
        if (!newUser || !newUser.user_id) {
            throw new Error('Error al crear el usuario en la base de datos');
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: newUser.user_id, email: newUser.email},
            process.env.JWT_SECRET, // Clave secreta desde variables de entorno
            { expiresIn: '1h' } // Expiración del token
        );

        // Respuesta exitosa con el usuario registrado y el token
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
              
                id: newUser.user_id,
                name: newUser.username,
                lastname: newUser.lastname,
                email: newUser.email,
                rol: newUser.rol,
                userbio: newUser.userbio,
                profileImage: newUser.foto_perfil_url,            
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

loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    const user = await usuariosModel.getUsuarioByEmail(email);

    if (!user) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    //const photoPerfilUrl = user.foto_perfil_url;
    //const baseUrl= 'https://piscina-api.onrender.com';
    //const perfilImage= `${baseUrl}${photoPerfilUrl}`;
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Generar JWT
    const token = jwt.sign({ id: user.usurio_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Login exitoso",
      data: {        
          id: user.user_id,
          name: user.username,
          lastname: user.lastname,
          email: user.email,
          rol: user.rol,
          userbio: user.userbio,
          profileImage: user.foto_perfil_url,      
        token: token,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
usuarioUpdate = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
      // Construir la consulta dinámica
      const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(updates);

      // Actualizar solo los campos modificados
      const user = await usuariosModel.updateUser(fields, values, userId);

      res.json({
        success: true,
        message: "usuario actualizado",
        data: {        
            id: user.user_id,
            name: user.username,
            lastname: user.lastname,
            email: user.email,
            rol: user.rol,
            userbio: user.userbio,
            profileImage: user.foto_perfil_url     
        
        },
      });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user', error });
  }
};

getMessages = async (req, res) => {
  try {
    const result = await usuariosModel.userMessages(); // Llama correctamente al método
    res.json(result.rows); // Envía los datos en formato JSON al frontend
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
};


module.exports = {loginUsuario,usuarioUpdate, registrarUsuario, getMessages}
