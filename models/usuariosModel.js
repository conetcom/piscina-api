const pool = require('./database');

const getUsuarioByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
};

exports.createUsuario = async (username, email, password, rol) => {
    const result = await pool.query(
        'INSERT INTO usuarios (username, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, username, email, rol',
        [username, email, password, rol]
    );
    return result.rows[0]; // Devuelve el usuario insertado con su ID
};


module.exports = { getUsuarioByEmail, createUsuario };
