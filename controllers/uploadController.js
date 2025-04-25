const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const usuariosModel = require('../models/usuariosModel'); // ✅ cambio aquí

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const { user_id } = req.body;

    if (!file || !user_id) {
      return res.status(400).json({ error: 'Faltan datos: imagen o user_id' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'piscina_app',
    });

    fs.unlinkSync(file.path);

    const fotoPerfilUrl = result.secure_url;
    console.log(fotoPerfilUrl, user_id)
    const updateUser = await usuariosModel.updatefoto(fotoPerfilUrl, user_id);

    res.status(200).json({
      message: 'Foto de perfil actualizada exitosamente',
      success: true,
      data: {
        
          id: updateUser.user_id,
          name: updateUser.username,
          lastname: updateUser.lastname,
          email: updateUser.email,
          rol: updateUser.rol,
          userbio: updateUser.userbio,
          profileImage: updateUser.foto_perfil_url,
        
      },
  });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen', details: error.message });
  }
};

module.exports = { uploadImage };
