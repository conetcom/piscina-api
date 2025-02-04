const pool = require('./database');

const getUsuarioByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
};

const createUsuario = async (name, email, hashedPassword, rol) => {
    const result = await pool.query(
        'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
        [id, nombre, email, rol]
    );
    
};

module.exports = { getUsuarioByEmail, createUsuario };
