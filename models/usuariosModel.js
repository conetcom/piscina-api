const pool = require('./database');

const getUsuarioByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
};

const createUsuario = async (username, lastname, email, hashedPassword, rol) => {
    const result = await pool.query(
        'INSERT INTO usuarios (username, lastname, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, username, lastname, email, rol',
        [username, lastname, email, hashedPassword, rol]
    );

    return result.rows[0]; // Devuelve el usuario insertado con su ID
};
// ACTUALIZAR USUARIOS
const updateUser = async (username, lastname, userbio, user_id) => {
  try {
    const query = `
      UPDATE usuarios
      SET username = $1, lastname = $2, userbio = $3
      WHERE user_id = $4
      RETURNING *; 

    `;
    
    const values = [username, lastname, userbio, user_id];
  
    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
      throw new Error('Usuario no encontrado o no actualizado');
    }
    
    console.log('User updated successfully');
    return result.rows[0];  // Retorna el usuario actualizado
  } catch (err) {
    console.error('Error updating user:', err);
    throw err;  // Re-lanza el error para que el llamador lo maneje
  }
};

// models/usuariosModel.js


const updatefoto = async (fotoPerfilUrl, user_id) => {
  try {
    const query = `UPDATE usuarios SET foto_perfil_url = $1 WHERE user_id = $2 RETURNING *`;
    const values = [fotoPerfilUrl, user_id];
    console.log(values);

    const result = await pool.query(query, values);
    return result.rows[0]; // Retorna el usuario actualizado
  } catch (err) {
    console.log(data)
    console.error('Error al actualizar la foto de perfil:', err);
    throw err;
  }
};

module.exports = { getUsuarioByEmail, createUsuario,updateUser, updatefoto};
