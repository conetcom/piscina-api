const pool = require('./database');

const getClientBynit = async (nit) => {
    const result = await pool.query('SELECT * FROM clientes WHERE cliente_id = $1', [nit]);
    return result.rows[0];
};

const createClient = async (ComanyName, phone, adress, nit, website) => {
    const result = await pool.query(
        'INSERT INTO clientes (Company_name, phone, adress, nit, website) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [ComanyName, phone, adress, nit, website]
    );

    return result.rows[0]; // Devuelve el usuario insertado con su ID
};
// ACTUALIZAR USUARIOS

// Función del modelo para actualizar los campos dinámicamente
const updateClient = async (fields, values, userId) => {
  try {
      // Construir la consulta dinámica
      const query = `UPDATE clientes SET ${fields} WHERE cliente_id = $${values.length + 1} RETURNING *`; // Añadir un placeholder para el userId
      values.push(userId); // Agregar el userId al final del array de valores
      
      console.log('Query:', query);
      console.log('Values:', values);

      // Ejecutar la consulta
      await pool.query(query, values);

      return { message: 'Client updated successfully' };
  } catch (error) {
      console.error('Error updating client:', error);
      throw new Error('Error updating client');
  }
};


module.exports = { getClientBynit, createClient, updateClient};