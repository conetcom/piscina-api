const pool = require('./database');

const getClientByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
    return result.rows[0];
};

const createClient = async (ComanyName, email, phone, adress, nit, website, hashedPassword) => {
    const result = await pool.query(
        'INSERT INTO usuarios (Company_name, email, phone, adress, nit, website, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [ComanyName, email, phone, adress, nit, website, hashedPassword]
    );

    return result.rows[0]; // Devuelve el usuario insertado con su ID
};
// ACTUALIZAR USUARIOS
const ClientUpdate = async (
    
) => {
  try {
    const query = `
      UPDATE usuarios
      SET email = $1, phone = $2, adress = $3, nit= $4, website= $5
      WHERE cliente_id = $6
      RETURNING *; 

    `;
    
    const values = [email, phone, adress, nit, website, cliente_id];
  
    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
      throw new Error('Cliente no encontrado o no actualizado');
    }
    
    console.log('client updated successfully');
    return result.rows[0];  // Retorna el usuario actualizado
  } catch (err) {
    console.error('Error updating client:', err);
    throw err;  // Re-lanza el error para que el llamador lo maneje
  }
};

// models/usuariosModel.js


/*const updatefoto = async (fotoPerfilUrl, user_id) => {
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
};*/

module.exports = { getClientByEmail, createClient, ClientUpdate};