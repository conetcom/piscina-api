const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.post('/register', usuariosController.registrarUsuario);
router.post('/login', usuariosController.loginUsuario);
router.put('/update/:id',usuariosController.usuarioUpdate);
router.get('/messages', usuariosController.getMessages);
router.post('/messages/:id/reply', usuariosController.replyToMessage);


module.exports = router;