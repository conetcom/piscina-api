const pool = require('./database');

const getUsuarioByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
};

const createUsuario = async (username, email, hashedPassword, rol) => {
    const result = await pool.query(
        'INSERT INTO usuarios (username, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, username, email, rol',
        [username, email, hashedPassword, rol]
    );

    return result.rows[0]; // Devuelve el usuario insertado con su ID
};


module.exports = { getUsuarioByEmail, createUsuario };
