const pool = require('./database');

const getUsuarioByEmail = async (email) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const createUsuario = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO usuarios (name, email, password_hash)
    VALUES ($1, $2, $3) RETURNING *`;
  const result = await pool.query(query, [name, email, passwordHash]);
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
