const productosModel = require('../models/stPiscinasModel');

exports.obtenerStPiscinas = async (req, res) => {
    const productos = await productosModel.getProductos();
    res.json(productos);
};

exports.obtenerStPiscinasById = async (req, res) => {
    const producto = await productosModel.getProductoById(req.params.id);
    res.json(producto);
};

exports.crearStPiscinas = async (req, res) => {
    const { id_piscina, id_cliente, ph, orp, st_bomba,st_light } = req.body;
    await productosModel.createProducto(id_piscina, id_cliente,ph, orp, st_bomba, st_light);
    res.status(201).send('registro lectura almacenado');
};

exports.actualizarStPiscinas = async (req, res) => {
    const { id_piscina, id_cliente, ph, orp, st_bomba,st_light } = req.body;
    await productosModel.updateProducto(req.params.id, id_piscina, id_cliente, ph, orp, st_bomba, st_light);
    res.send('Producto actualizado');
};

exports.eliminarStPiscinas = async (req, res) => {
    await productosModel.deleteProducto(req.params.id);
    res.send('Producto eliminado');
};
