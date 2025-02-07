const express = require('express');
const router = express.Router();
const stPiscinasController = require('../controllers/stPiscinaController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', stPiscinasController.obtenerStPiscinas);
router.get('/:id', stPiscinasController.obtenerStPiscinasById);
router.post('/', /*authMiddleware*,*/ stPiscinasController.crearStPiscinas);
router.put('/:id', authMiddleware, stPiscinasController.actualizarStPiscinas);
router.delete('/:id', authMiddleware, stPiscinasController.eliminarStPiscinas);

module.exports = router;
