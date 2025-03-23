const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/clientModel');

registerClient = async (req, res) => {
    try {
        const { ComanyName, email, phone, adress, nit, website, password} = req.body;

        // Verificar si el usuario ya existe
        const clientExistente = await clientModel.getClientByEmail(email);
        if (clientExistente) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado',
            });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario en la base de datos
        const newClient = await clientModel.createClient(ComanyName, email, phone, adress, nit, website, hashedPassword);

        // Verificar que el usuario se haya creado correctamente
        if (!newClient || !newClient.cliente_id) {
            throw new Error('Error al crear el cliente en la base de datos');
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: newClient.cliente_id, email: newClient.email},
            process.env.JWT_SECRET, // Clave secreta desde variables de entorno
            { expiresIn: '1h' } // Expiración del token
        );

        // Respuesta exitosa con el usuario registrado y el token
        res.status(201).json({
            success: true,
            message: 'Cliente registrado exitosamente',
            data: {
              
                id: newClient.cliente_id,
                companyname: newClient.company_name,
                lastname: newClient.email,
                email: newClient.phone,
                rol: newClient.adress,
                userbio: newClient.nit,
                profileImage: newClient.website,            
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

loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    const user = await clientModel.getclientByEmail(email);

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
    const token = jwt.sign({ id: user.cliente_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
              
        id: user.cliente_id,
        companyname: user.company_name,
        lastname: user.email,
        email: user.phone,
        rol: user.adress,
        userbio: user.nit,
        profileImage: user.website,            
        token: token,
    },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
ClientUpdate = async (req, res) => {
  const { email, phone, adress, nit, website, cliente_id } = req.body;

  try {
    // Buscar usuario en la base de datos
    const client = await clientModel.getClientByEmail(email);
    //console.log(users);
    
    // Verificar si el usuario existe
    if (!client) {
      return res.status(401).json({ success: false, message: "Error: cliente no encontrado" });
    }
    
    const cliente_id = client.cliente_id; // Extraer el user_id del usuario encontrado
  

    // Hashear la contraseña
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar el usuario en la base de datos
    const upClient = await clientModel.clientupdate(email, phone, adress, nit, website, cliente_id);
   // console.log(updateUser);

    // Verificar que el usuario se haya actualizado correctamente
    if (!upClient || !upClient.cliente_id) {
      throw new Error('Error al actualizar el Cliente en la base de datos');
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: upClient.cliente_id, email: upClient.email },
      process.env.JWT_SECRET, // Clave secreta desde variables de entorno
      { expiresIn: '1h' } // Expiración del token
    );

    // Respuesta exitosa con el usuario actualizado y el token
    res.status(201).json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: {
              
        id: updateClient.cliente_id,
        companyname: updateClient.company_name,
        lastname: updateClient.email,
        email: updateClient.phone,
        rol: updateClient.adress,
        userbio: updateClient.nit,
        profileImage: updateClient.website,            
        token: token,
    },
    });

  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el Cliente',
      error: error.message,
    });
  }
};

module.exports = {registerClient,loginClient, ClientUpdate}
