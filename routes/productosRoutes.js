const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', productosController.obtenerProductos);
router.get('/:id', productosController.obtenerProductoPorId);
router.post('/', /*authMiddleware*,*/ productosController.crearProducto);
router.put('/:id', authMiddleware, productosController.actualizarProducto);
router.delete('/:id', authMiddleware, productosController.eliminarProducto);

module.exports = router;
