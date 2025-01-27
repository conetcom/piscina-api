const pool = require('./database');

const getProductos = async () => {
    const result = await pool.query('SELECT * FROM piscina');
    return result.rows;
};

const getProductoById = async (id) => {
    const result = await pool.query('SELECT * FROM piscina WHERE id = $1', [id_cliente]);
    return result.rows[0];
};

const createProducto = async (id_cliente, ph, orp, st_bomba, st_ligth) => {
    await pool.query('INSERT INTO piscina (id_cliente, ph, orp, st_bomba, st_ligth) VALUES ($1, $2, $3, $4, $%)', [id_cliente, ph, orp, st_bomba, st_ligth]);
};

const updateProducto = async (id_cliente, ph, orp, st_bomba, st_ligth) => {
    await pool.query('UPDATE productos SET id_cliente = $1, ph = $2, orp= $3, st_bomba = $4 WHERE id = $5', [id_cliente, ph, orp, st_bomba, st_ligth]);
};

const deleteProducto = async (id_cliente) => {
    await pool.query('DELETE FROM piscina WHERE id = $1', [id_cliente]);
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };
