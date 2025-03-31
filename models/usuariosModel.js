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
const updateUser = async (fields, values, userId) => {
  try {
      // Construir la consulta dinámica
      const query = `UPDATE usuarios SET ${fields} WHERE user_id = $${values.length + 1} RETURNING *`; // Añadir un placeholder para el userId
      values.push(userId); // Agregar el userId al final del array de valores
      
      console.log('Query:', query);
      console.log('Values:', values);

      // Ejecutar la consulta
      const result=await pool.query(query, values);

      return result.rows[0];
      
  } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error updating user');
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

const userMessages = async () => {
  try {
    const query = 'SELECT * FROM messages ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result; // Devuelve el resultado de la consulta
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error; // Lanza el error para que sea manejado en el controlador
  }
};

module.exports = { getUsuarioByEmail, createUsuario,updateUser, updatefoto, userMessages};
