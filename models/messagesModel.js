const pool = require('./database');

const saveMessages = async (text, sender, user_id, avatar) => {
  const query = `
    INSERT INTO messages (messages, users, user_id, avatar_url, created_at)
    VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
  const values = [text, sender, user_id, avatar];
  const result = await pool.query(query, values);

  // Obtener solo el username del usuario
  const fullMessage = {
    user_id,
    avatar_url: avatar,// 👈 ya lo tienes
    messages: text,
    users: sender,
    replies: [],
  };

  return fullMessage;
};

const userMessages = async () => {
  const query = 'SELECT * FROM messages ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

const saveReplyToMessage = async (messageId, userId, reply, avatar) => {
  const query = `
    INSERT INTO message_replies (message_id, user_id, reply)
    VALUES ($1, $2, $3) RETURNING *`;
  const values = [messageId, userId, reply];
  const result = await pool.query(query, values);
  
  // Devuelve el reply con el avatar propagado
  const fullMessage = {
    ...result.rows[0],
    avatar_url: avatar
  };
  console.log(fullMessage);
  return fullMessage;
};

const getMessagesWithReplies = async () => {
  try {
    const messagesQuery = `
     SELECT m.*, u.username AS usuarios
    FROM messages m
    JOIN usuarios u ON m.user_id = u.user_id
    ORDER BY m.created_at DESC; LIMIT 10`;

    const repliesQuery = `
      SELECT r.*, u.username AS username
    FROM message_replies r
    LEFT JOIN usuarios u ON r.user_id = u.user_id;`;

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
      replies: repliesByMessage[msg.id] || [],  // Asocia las respuestas al mensaje
    }));

    return messagesWithReplies;
  } catch (error) {
    console.error('Error al obtener mensajes con respuestas:', error.message);
    throw new Error('Error al obtener mensajes con respuestas');
  }
};

const getMessageByIdWithReplies = async (id) => {
  try {
    const messageQuery = `
      SELECT * FROM messages WHERE id = $1`;
    const repliesQuery = `
      SELECT * FROM message_replies WHERE message_id = $1 ORDER BY created_at ASC`;

    const [messageResult, repliesResult] = await Promise.all([
      pool.query(messageQuery, [id]),
      pool.query(repliesQuery, [id]),
    ]);

    if (messageResult.rows.length === 0) {
      throw new Error('Mensaje no encontrado');
    }

    const message = messageResult.rows[0];
    message.replies = repliesResult.rows;

    return message;
  } catch (error) {
    console.error('Error al obtener mensaje con replies:', error.message);
    throw error;
  }
};

module.exports = {
  saveMessages,
  userMessages,
  saveReplyToMessage,
  getMessagesWithReplies,
  getMessageByIdWithReplies,
};
