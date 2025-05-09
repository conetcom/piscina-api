const messagesModel = require('../models/messagesModel');

let users = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('register', (userId) => {
      users[userId] = socket.id;
    });
  });
  //verificar mensajes leidos    
      socket.on('markMessageAsRead', async ({ messageId }) => {
        try {
          await messagesModel.makeMessageAsRead(messageId);
          console.log(`Mensaje ${messageId} marcado como leído`);
        } catch (err) {
          console.error('Error marcando como leído:', err);
        }
      });
    
    

    // Obtener todos los mensajes
    socket.on('getAllMessages', async () => {
      try {
        const messages = await messagesModel.getMessagesWithReplies();
        socket.emit('allMessages', messages);
      } catch (error) {
        console.error('Error al obtener mensajes previos:', error);
      }
    });

    // Nuevo mensaje
    socket.on('sendMessage', async ({ content, user_id, name, avatar }) => {
      try {
        const newMessage = await messagesModel.saveMessages(content, user_id, name, avatar);
      io.emit('newMessage', {
      ...newMessage,
      type: 'message', // <- Para saber que es un mensaje
      id: newMessage.id // <- El id del mensaje
    });
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
  }
   // Respuesta a un mensaje
socket.on('sendReply', async ({ messageId, reply, userId }) => {
  try {
    const newReply = await messagesModel.saveReplyToMessage(messageId, userId, reply);

    // Encontramos el mensaje actualizado con sus respuestas
    const updatedMessages = await messagesModel.getMessagesWithReplies();
    const targetMessage = updatedMessages.find(m => m.id === messageId);

    io.emit('newReply', {
      ...targetMessage,
      reply: newReply.reply,          // Solo el texto de la nueva respuesta
      username: newReply.username,    // Si lo tienes en la base de datos
      avatar_url: newReply.avatar,    // Asegúrate de que esté disponible
      type: 'reply',                  // <- Para distinguirlo en el frontend
      id: messageId                   // <- Para redirigir a este mensaje
    });
  } catch (error) {
    console.error('Error al guardar respuesta:', error.message);
  }
});

    socket.on('disconnect', () => {
      // Usuario desconectado
    });
  });
};
