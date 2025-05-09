const messagesModel = require('../models/messagesModel');

let users = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado');

    // Registrar usuario
    socket.on('register', (userId) => {
      users[userId] = socket.id;
      console.log(`🟢 Usuario ${userId} registrado con socket ${socket.id}`);
    });

    // ✅ Marcar mensaje como leído
    socket.on('markMessageAsRead', async ({ messageId }) => {
      try {
        await messagesModel.makeMessageAsRead(messageId);
        console.log(`📩 Mensaje ${messageId} marcado como leído`);
      } catch (err) {
        console.error('❌ Error marcando como leído:', err);
      }
    });

    // ✅ Obtener todos los mensajes
    socket.on('getAllMessages', async () => {
      try {
        const messages = await messagesModel.getMessagesWithReplies();
        socket.emit('allMessages', messages);
      } catch (error) {
        console.error('❌ Error al obtener mensajes previos:', error);
      }
    });

    // ✅ Nuevo mensaje
    socket.on('sendMessage', async ({ content, user_id, name, avatar }) => {
      try {
        const newMessage = await messagesModel.saveMessages(content, user_id, name, avatar);
        io.emit('newMessage', {
          ...newMessage,
          type: 'message',
          id: newMessage.id,
        });
      } catch (error) {
        console.error('❌ Error al guardar mensaje:', error);
      }
    });

    // ✅ Nueva respuesta
    socket.on('sendReply', async ({ messageId, reply, userId }) => {
      try {
        const newReply = await messagesModel.saveReplyToMessage(messageId, userId, reply);

        const updatedMessages = await messagesModel.getMessagesWithReplies();
        const targetMessage = updatedMessages.find(m => m.id === messageId);

        io.emit('newReply', {
          ...targetMessage,
          reply: newReply.reply,
          username: newReply.username,
          avatar_url: newReply.avatar,
          type: 'reply',
          id: messageId,
        });
      } catch (error) {
        console.error('❌ Error al guardar respuesta:', error.message);
      }
    });

    // ✅ Desconexión
    socket.on('disconnect', () => {
      console.log('🔌 Cliente desconectado');
    });
  });
};
