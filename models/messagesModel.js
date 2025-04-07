const pool = require('../db');

const saveMessages = async (text, sender, user_id, foto_perfil_url) => {
  const query = `
    INSERT INTO messages (messages, users, user_id, foto_perfil_url, created_at)
    VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
  const values = [text, sender, user_id, foto_perfil_url];
  const result = await pool.query(query, values);
  return result;
};

const userMessages = async () => {
  const query = 'SELECT * FROM messages ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

const saveReplyToMessage = async (messageId, userId, reply) => {
  const query = `
    INSERT INTO message_replies (message_id, user_id, reply)
    VALUES ($1, $2, $3)`;
  const values = [messageId, userId, reply];
  await pool.query(query, values);
};

module.exports = {
  saveMessages,
  userMessages,
  saveReplyToMessage
};
