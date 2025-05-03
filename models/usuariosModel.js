const pool = require('./database');

const getUsuarioByEmail = async (email) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const createUsuario = async (username, lastname, email, hashedPassword, rol, ) => {
  const query = `
    INSERT INTO usuarios (username, lastname, email, password, rol)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const result = await pool.query(query, [username, lastname, email, hashedPassword, rol]);
  return result.rows[0];
};

const updateUser = async (fields, values, userId) => {
  const query = `UPDATE usuarios SET ${fields} WHERE user_id = $${values.length + 1} RETURNING *`;
  values.push(userId);
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updatefoto = async (fotoPerfilUrl, user_id) => {
  const query = `UPDATE usuarios SET foto_perfil_url = $1 WHERE user_id = $2 RETURNING *`;
  const values = [fotoPerfilUrl, user_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  getUsuarioByEmail,
  createUsuario,
  updateUser,
  updatefoto
};
