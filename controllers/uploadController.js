const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { usuariosModel } = require('../models/usuariosModel');

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const { user_id } = req.body; // 👈 Llega del frontend (formData)

    if (!file || !user_id) {
      return res.status(400).json({ error: 'Faltan datos: imagen o user_id' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'piscina_app',
    });

    fs.unlinkSync(file.path);
console.log(result);
    const imagenGuardada = await usuariosModel.updatefoto(file.originalname, result.secure_url, result.public_id, user_id);

    res.status(200).json({
      message: 'Imagen subida correctamente',
      data: imagenGuardada,
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen', details: error.message });
  }
};

module.exports = { uploadImage };
