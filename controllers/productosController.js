const productosModel = require('../models/productosModel');

exports.obtenerProductos = async (req, res) => {
    const productos = await productosModel.getProductos();
    res.json(productos);
};

exports.obtenerProductoPorId = async (req, res) => {
    const producto = await productosModel.getProductoById(req.params.id);
    res.json(producto);
};

exports.crearProducto = async (req, res) => {
    const { nombre, precio } = req.body;
    await productosModel.createProducto(nombre, precio);
    res.status(201).send('Producto creado');
};

exports.actualizarProducto = async (req, res) => {
    const { nombre, precio } = req.body;
    await productosModel.updateProducto(req.params.id, nombre, precio);
    res.send('Producto actualizado');
};

exports.eliminarProducto = async (req, res) => {
    await productosModel.deleteProducto(req.params.id);
    res.send('Producto eliminado');
};
