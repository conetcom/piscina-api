const pool = require('./database');

const saveMessages = async (content, user_id, username, avatar_url) => {
  const insertQuery = `
    INSERT INTO messages (messages, user_id)
    VALUES ($1, $2)
    RETURNING *`;
  const insertValues = [content, user_id];
  const { rows: [messageRow] } = await pool.query(insertQuery, insertValues);

  const fullMessage = {
    id: messageRow.id,
    messages: messageRow.messages,
    user_id: messageRow.user_id,
    created_at: messageRow.created_at,
    username,
    avatar_url,
    replies: [],
  };

  return fullMessage;
};

const saveReplyToMessage = async (messageId, userId, reply) => {
  const insertQuery = `
    INSERT INTO message_replies (message_id, user_id, reply)
    VALUES ($1, $2, $3)
    RETURNING message_id, user_id, reply, created_at`;
  const result = await pool.query(insertQuery, [messageId, userId, reply]);
  const newReply = result.rows[0];

  const userQuery = `
    SELECT username, foto_perfil_url AS avatar_url
    FROM usuarios
    WHERE user_id = $1`;
  const userResult = await pool.query(userQuery, [userId]);
  const user = userResult.rows[0];

  return {
    id: newReply.id,
    user_id: newReply.user_id,
    reply: newReply.reply,
    created_ad: newReply.created_at,
    username: user?.username || null,
    avatar_url: user?.avatar_url || null,
  };
};


const getMessagesWithReplies = async () => {
  const messagesQuery = `
    SELECT 
      m.*, 
      u.username, 
      u.foto_perfil_url AS avatar_url
    FROM messages m
    JOIN usuarios u ON m.user_id = u.user_id
    ORDER BY m.created_at DESC
    LIMIT 5`;
  const messagesResult = await pool.query(messagesQuery);
  const messages = messagesResult.rows;

  const messageIds = messages.map(m => m.id);
  if (messageIds.length === 0) return [];

  const repliesQuery = `
    SELECT 
      r.*, 
      u.username AS reply_username, 
      u.foto_perfil_url AS reply_avatar_url
    FROM message_replies r
    LEFT JOIN usuarios u ON r.user_id = u.user_id
    WHERE r.message_id = ANY($1)
    ORDER BY r.created_at ASC`;
  const repliesResult = await pool.query(repliesQuery, [messageIds]);

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

  return messages.map(msg => ({
    id: msg.id,
    user_id: msg.user_id,
    messages: msg.messages,
    created_at: msg.created_at,
    username: msg.username,
    avatar_url: msg.avatar_url,
    replies: repliesByMessage[msg.id] || [],
  }));
};

module.exports = {
  saveMessages,
  saveReplyToMessage,
  getMessagesWithReplies,
};
