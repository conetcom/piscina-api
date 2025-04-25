const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');

// Configurar multer para guardar en /tmp temporalmente
const storage = multer.diskStorage({
  destination: 'tmp/', // carpeta temporal
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
