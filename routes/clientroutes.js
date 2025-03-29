const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/register', clientController.registerClient );
router.post('/login', clientController.loginClient);
// Para actualizar un cliente específico, deberías incluir el ID del cliente en la URL
router.put('/update/:id', clientController.ClientUpdate); // Actualizar cliente


module.exports = router;