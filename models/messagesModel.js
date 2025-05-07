const pool = require('./database');

const saveMessages = async (content, user_id) => {
  // 1. Insertar mensaje en la tabla `messages`
  const insertQuery = `
    INSERT INTO messages (messages, user_id, created_at)
    VALUES ($1, $2, NOW()) RETURNING id, messages, user_id, created_at`;
  const insertValues = [content, user_id];
  const { rows: [messageRow] } = await pool.query(insertQuery, insertValues);

  // 2. Consultar al usuario correspondiente
  const userQuery = `SELECT username, foto_perfil_url AS avatar_url FROM usuarios WHERE user_id = $1`;
  const userValues = [user_id];
  const { rows: [userRow] } = await pool.query(userQuery, userValues);

  // 3. Construir el mensaje completo
  const fullMessage = {
    id: messageRow.id,
    messages: messageRow.messages,
    user_id: messageRow.user_id,
    created_at: messageRow.created_at,
    username: userRow.username,
    avatar_url: userRow.avatar_url,
    replies: [],
  };

  return fullMessage;
};


const userMessages = async () => {
  const query = 'SELECT * FROM messages ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

const saveReplyToMessage = async (messageId, userId, reply) => {
  const insertQuery = `
    INSERT INTO message_replies (message_id, user_id, reply)
    VALUES ($1, $2, $3)
    RETURNING *`;
  const insertValues = [messageId, userId, reply];
  const result = await pool.query(insertQuery, insertValues);
  const newReply = result.rows[0];

  const userQuery = `
    SELECT username, foto_perfil_url AS avatar_url
    FROM usuarios
    WHERE user_id = $1
  `;
  const userResult = await pool.query(userQuery, [userId]);
  const user = userResult.rows[0];
  console.log(userResult, user)

  return {
    ...newReply,
    username: user?.username || null,
    avatar_url: user?.avatar_url || null,
  };
};

const getMessagesWithReplies = async () => {
  try {
    // Paso 1: Obtener los últimos 5 mensajes con datos del usuario
    const messagesQuery = `
      SELECT 
        m.*, 
        u.username, 
        u.foto_perfil_url AS avatar_url
      FROM messages m
      JOIN usuarios u ON m.user_id = u.user_id
      ORDER BY m.created_at DESC
      LIMIT 5
    `;

    const messagesResult = await pool.query(messagesQuery);
    const messages = messagesResult.rows;

    // Obtener solo los IDs de esos 5 mensajes
    const messageIds = messages.map(m => m.id);

    if (messageIds.length === 0) return [];

    // Paso 2: Obtener las replies SOLO de esos mensajes
    const repliesQuery = `
      SELECT 
        r.*, 
        u.username AS reply_username, 
        u.foto_perfil_url AS reply_avatar_url
      FROM message_replies r
      LEFT JOIN usuarios u ON r.user_id = u.user_id
      WHERE r.message_id = ANY($1)
      ORDER BY r.created_at ASC
    `;
    const repliesResult = await pool.query(repliesQuery, [messageIds]);

    // Organizar las replies por message_id
    const repliesByMessage = repliesResult.rows.reduce((acc, reply) => {
      if (!acc[reply.message_id]) acc[reply.message_id] = [];
      acc[reply.message_id].push({
        id: reply.id,
        message_id: reply.message_id,
        user_id: reply.user_id,
        reply: reply.reply,
        created_at: reply.created_at,
        username: reply.reply_username,
        avatar_url: reply.reply_avatar_url,
      });
      return acc;
    }, {});

    // Paso 3: Unir los mensajes con sus replies
    const messagesWithReplies = messages.map(msg => ({
      id: msg.id,
      user_id: msg.user_id,
      messages: msg.messages,
      created_at: msg.created_at,
      username: msg.username,
      avatar_url: msg.avatar_url,
      replies: repliesByMessage[msg.id] || [],
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
