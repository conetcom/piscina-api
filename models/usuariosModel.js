const pool = require('./database');

const getUsuarioByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
};

const createUsuario = async (username, lastName, email, hashedPassword, rol) => {
    const result = await pool.query(
        'INSERT INTO usuarios (username, lastName, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, lastName, email, rol',
        [username, lastName, email, hashedPassword, rol]
    );

    return result.rows[0]; // Devuelve el usuario insertado con su ID
};
// ACTUALIZAR USUARIOS
const updateUser = async (
     firstName, lastName, bio, email) => {
  try {
    const query = `
      UPDATE users
      SET first_name = $1, last_name = $2, bio = $3, email = $4
      WHERE id = $5;
    `;
    
    const values = [firstName, lastName, bio, email, userId];

    const result = await pool.query(query, values);
    
    console.log('User updated successfully');
    return result.rows[0]
  } catch (err) {
    console.error('Error updating user:', err);
  }
};

// Ejemplo de uso:
//updateUser(1, 'Jane', 'Smith', 'Software engineer with a passion for design.', 'jane.smith@example.com');



module.exports = { getUsuarioByEmail, createUsuario,updateUser };
