const messageModel = require('../models/messagesModel'); // ✅


// GET /api/usuarios/messages
const getMessages = async (req, res) => {
  try {
    const messages = await messageModel.userMessages();
    console.log('paso por aqui');
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

// POST /api/usuarios/messages
const createMessage = async (req, res) => {
  const { text, sender, user_id, foto_perfil_url } = req.body;

  if (!text || !sender || !user_id) {
    return res.status(400).json({ error: 'Campos incompletos' });
  }

  try {
    const result = await messageModel.saveMessages(text, sender, user_id, foto_perfil_url);
    const newMessage = result.rows[0];

    // Emitimos el mensaje vía WebSocket
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
    await messageModel.saveReplyToMessage(id, user_id, reply);

    if (req.io) {
      req.io.emit('newReply', { messageId: id, reply, user_id });
    }

    res.status(201).json({ message: 'Respuesta guardada correctamente' });
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
