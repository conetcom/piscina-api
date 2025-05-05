const messagesModel = require('../models/messagesModel');

// GET /api/usuarios/messages
const getMessages = async (req, res) => {
  try {
    const messages = await messagesModel.getMessagesWithReplies();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes con respuestas:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

// POST /api/usuarios/messages
const createMessage = async (req, res) => {
  const { text, user_id } = req.body;

  if (!text || !user_id) {
    return res.status(400).json({ error: 'Faltan el texto o el usuario para el mensaje' });
  }

  try {
    const result = await messagesModel.saveMessages(text, user_id);
    const newMessage = result;

    if (req.io) {
      req.io.emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    res.status(500).json({ error: 'Error al crear mensaje' });
  }
};

// POST /api/usuarios/messages/:id/reply
const replyToMessage = async (req, res) => {
  const { id } = req.params;
  const { reply, user_id } = req.body;

  if (!reply || !user_id) {
    return res.status(400).json({ error: 'Faltan datos para responder' });
  }

  try {
    const result = await messagesModel.saveReplyToMessage(id, user_id, reply);
    const updatedMessage = await messagesModel.getMessageByIdWithReplies(id);

    if (req.io) {
      req.io.emit('newReply', updatedMessage);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error al guardar respuesta:', error);
    res.status(500).json({ error: 'Error al guardar respuesta' });
  }
};

module.exports = {
  getMessages,
  createMessage,
  replyToMessage
};
