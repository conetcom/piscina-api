const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const usuariosController = require('../controllers/usuariosController');

router.post('/register', usuariosController.registrarUsuario);
router.post('/login', usuariosController.loginUsuario);
router.put('/update/:id',authMiddleware,usuariosController.usuarioUpdate);
router.get('/messages', authMiddleware, usuariosController.getMessages);
router.post('/messages/:id/reply', authMiddleware, usuariosController.replyToMessage);


module.exports = router;