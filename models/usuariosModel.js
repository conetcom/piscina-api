const pool = require('./database');

const getUsuarioByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
};

const createUsuario = async (name, email, hashedPassword, rol) => {
    await pool.query('INSERT INTO usuarios (name, email, password, rol) VALUES ($1, $2, $3, $4)', [name, email, hashedPassword,rol]);
    
};

module.exports = { getUsuarioByEmail, createUsuario };
