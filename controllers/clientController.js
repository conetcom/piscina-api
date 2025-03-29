const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const clientModel = require('../models/clientModel');

registerClient = async (req, res) => {
    try {
        const { ComanyName, phone, adress, nit, website} = req.body;

        // Verificar si el usuario ya existe
        const clientExistente = await clientModel.getClientByEmail(email);
        if (clientExistente) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado',
            });
        }

        

        // Crear el usuario en la base de datos
        const newClient = await clientModel.createClient(ComanyName, phone, adress, nit, website);

        // Verificar que el usuario se haya creado correctamente
        if (!newClient || !newClient.cliente_id) {
            throw new Error('Error al crear el cliente en la base de datos');
        }

        

        // Respuesta exitosa con el usuario registrado y el token
        res.status(201).json({
            success: true,
            message: 'Cliente registrado exitosamente',
            data: {
              
                id: newClient.cliente_id,
                companyname: newClient.company_name,
                phone: newClient.phone,
                adress:  newClient.adress,
                nit: newClient.nit,
                website: newClient.website,            
                
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
  const userId = req.params.id;
  const updates = req.body;

  try {
      // Construir la consulta dinámica
      const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(updates);

      // Actualizar solo los campos modificados
      const result = await clientModel.updateClient(fields, values, userId);

      res.status(200).json({ message: 'client updated successfully' });
  } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({ message: 'Error updating client', error });
  }
};



module.exports = {registerClient,loginClient, ClientUpdate}
