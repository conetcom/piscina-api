const pool = require('./database');

const getProductos = async () => {
    const result = await pool.query('SELECT * FROM estado_piscinas');
    return result.rows;
};

const getProductoById = async (id) => {
    const result = await pool.query('SELECT * FROM estado_piscinas WHERE id = $1', [id_piscina]);
    return result.rows[0];
};

const createProducto = async (id_piscina, id_cliente, ph, orp, st_bomba, st_ligth) => {
    await pool.query('INSERT INTO estado_piscinas (id_piscina, id_cliente, ph, orp, st_bomba, st_light) VALUES ($1, $2, $3, $4, $5, $6)', [id_piscina, id_cliente, ph, orp, st_bomba, st_ligth]);
};

const updateProducto = async (id_cliente, ph, orp, st_bomba, st_ligth) => {
    await pool.query('UPDATE estado_piscinas SET id_piscina= $1, id_cliente = $2, ph = $3, orp= $4, st_bomba = $5. st_light = $6 WHERE id = $1', [id_piscina, id_cliente, ph, orp, st_bomba, st_light]);
};

const deleteProducto = async (id_cliente) => {
    await pool.query('DELETE FROM estado_piscinas WHERE id = $1', [id_cliente]);
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };
