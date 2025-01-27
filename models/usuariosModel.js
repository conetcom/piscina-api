const pool = require('./database');

const getUsuarioByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM cliente WHERE email = $1', [email]);
    return result.rows[0];
};

const createUsuario = async (id,nombre, email, hashedPassword) => {
    await pool.query('INSERT INTO cliente (id, nombre, email, password) VALUES ($1, $2, $3, $4)', [id, nombre, email, hashedPassword]);
};

module.exports = { getUsuarioByEmail, createUsuario };
