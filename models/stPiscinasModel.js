const pool = require('./database');

const getstPiscinas = async () => {
  
    const result = await pool.query('SELECT * FROM estado_piscinas ORDER BY fecha_registro DESC LIMIT 1');
    return result.rows;
};

const getstPiscinasById = async (id) => {
    const result = await pool.query('SELECT * FROM estado_piscinas WHERE id = $1', [id_piscina]);
    return result.rows[0];
};

const createstPiscinas = async (piscina_id, ph, orp, st_bombas, st_ligth) => {
    await pool.query('INSERT INTO estado_piscinas (piscina_id, ph, orp, st_bombas, st_light) VALUES ($1, $2, $3, $4, $5)', [piscina_id, ph, orp, st_bombas, st_ligth]);
};

const updatestPiscinas = async (piscina_id, ph, orp, st_bombas, st_ligth) => {
    await pool.query('UPDATE estado_piscinas SET piscina_id = $1, ph = $2, orp= $3, st_bombas = $4, st_ligth = $5 WHERE id = $1', [piscina_id, ph, orp, st_bombas, st_ligth]);
};

const deletestPiscinas = async (piscina_id) => {
    await pool.query('DELETE FROM estado_piscinas WHERE id = $1', [piscina_id]);
};

module.exports = { getstPiscinas, getstPiscinasById, createstPiscinas, updatestPiscinas, deletestPiscinas};
