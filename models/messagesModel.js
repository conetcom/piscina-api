const pool = require('./database');

const saveMessages = async (text, sender, user_id, avatar) => {
  const query = `
    INSERT INTO messages (messages, users, user_id, avatar_url, created_at)
    VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
  const values = [text, sender, user_id, avatar];
  const result = await pool.query(query, values);
  return result;
};

const userMessages = async () => {
  const query = 'SELECT * FROM messages ORDER BY created_at DESC';
  const result = await pool.query(query);
  console.log(result);
  return result.rows;
};

const saveReplyToMessage = async (messageId, userId, reply) => {
  const query = `
    INSERT INTO message_replies (message_id, user_id, reply)
    VALUES ($1, $2, $3)`;
  const values = [messageId, userId, reply];
  await pool.query(query, values);
};

const getMessagesWithReplies = async () => {
  try {
    const messagesQuery = `
      SELECT * FROM messages ORDER BY created_at DESC
    `;
    const repliesQuery = `
      SELECT * FROM message_replies
    `;

    const [messagesResult, repliesResult] = await Promise.all([
      pool.query(messagesQuery),
      pool.query(repliesQuery),
    ]);

    const repliesByMessage = repliesResult.rows.reduce((acc, reply) => {
      if (!acc[reply.message_id]) {
        acc[reply.message_id] = [];
      }
      acc[reply.message_id].push(reply);
      return acc;
    }, {});

    const messagesWithReplies = messagesResult.rows.map((msg) => ({
      ...msg,
      replies: repliesByMessage[msg.id] || [],
    }));

    return messagesWithReplies;
  } catch (error) {
    console.error('Error al obtener mensajes con respuestas:', error);
    throw error;
  }
};

module.exports = {
  saveMessages,
  userMessages,
  saveReplyToMessage,
  getMessagesWithReplies
};
