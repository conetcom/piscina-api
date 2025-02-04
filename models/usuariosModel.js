const pool = require('./database');

const getUsuarioByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
};

exports.createUsuario = async (name, email, password, rol) => {
    const result = await pool.query(
        'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre AS name, email, rol',
        [name, email, password, rol]
    );
    return result.rows[0]; // Devuelve el usuario insertado con su ID
};


module.exports = { getUsuarioByEmail, createUsuario };
