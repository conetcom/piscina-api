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
    const { id_piscina, id_cliente, ph, orp, st_bomba,st_light } = req.body;
    await productosModel.createProducto(id_piscina, id_cliente,ph, orp, st_bomba, st_light);
    res.status(201).send('registro lectura almacenado');
};

exports.actualizarProducto = async (req, res) => {
    const { id_piscina, id_cliente, ph, orp, st_bomba,st_light } = req.body;
    await productosModel.updateProducto(req.params.id, id_piscina, id_cliente, ph, orp, st_bomba, st_light);
    res.send('Producto actualizado');
};

exports.eliminarProducto = async (req, res) => {
    await productosModel.deleteProducto(req.params.id);
    res.send('Producto eliminado');
};
