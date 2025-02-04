const pool = require('./database');

const getUsuarioByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM cliente WHERE email = $1', [email]);
    return result.rows[0];
};

const createUsuario = async (nombre, email, hashedPassword, rol) => {
    await pool.query('INSERT INTO cliente (nombre, email, password, rol) VALUES ($1, $2, $3, $4)', [nombre, email, hashedPassword,rol]);
    
};

module.exports = { getUsuarioByEmail, createUsuario };
