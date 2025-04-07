// routes/userRoutes.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const usuariosModel = require('../models/usuariosModel'); // Importar el modelo de usuario

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`; // Nombre único basado en el timestamp
    cb(null, filename);
  },
});


const upload = multer({ storage: storage });



// Ruta para subir la imagen y actualizar el perfil
router.post('/upload-profile-pic', upload.single('foto_perfil_url'), async (req, res) => {
  const { user_id } = req.body;
  const fotoPerfilUrl = req.file ? `https://piscina-api.onrender.com/uploads/${req.file.filename}` : null;

  if (!user_id || !fotoPerfilUrl) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  try {
    const updateUser = await usuariosModel.updatefoto(fotoPerfilUrl, user_id);

    if (!updateUser) {
      throw new Error('Error al actualizar la foto de perfil');
    }

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
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});

/*


// Configurar Multer para subir imágen
// es
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'https://piscina-api.onrender.com/uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`; // Nombre único basado en el timestamp
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Ruta para actualizar la foto de perfil
router.post('/upload-profile-pic', upload.single('foto_perfil_url'), async (req, res) => {
  const { user_id } = req.body; // Recibe el user_id en la solicitud
  
  const fotoPerfilUrl = req.file ? `https://piscina-api.onrender.com/uploads/${req.file.filename}` : null;
  //const baseUrl = 'https://piscina-api.onrender.com';
  //const  fotoPerfilUrl= `${baseUrl}${photoPerfilUrl}`;

  if (!user_id || !fotoPerfilUrl) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  try {
    const updateUser = await usuariosModel.updatefoto(fotoPerfilUrl, user_id);

    if (!updateUser) {
      throw new Error('Error al actualizar la foto de perfil');
    }

    res.status(200).json({
    
       
      message: 'Foto de perfil actualizada exitosamente',
      success: true,
      data: {
        
        user: {
            id: updateUser.user_id,
            name: updateUser.username,
            lastname: updateUser.lastname,
            email: updateUser.email,
            rol: updateUser.rol,
            userbio:updateUser.userbio,
            profileImage: updateUser.foto_perfil_url,
        }
    }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});*/

module.exports = router;
