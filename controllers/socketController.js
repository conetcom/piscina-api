const messagesModel = require('../models/messagesModel');

let users = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('register', (userId) => {
      users[userId] = socket.id;
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
    socket.on('sendMessage', async ({ user_id, content, name, avatar }) => {
      try {
        const newMessage = await messagesModel.saveMessages(user_id, content, name, avatar);
        io.emit('newMessage', newMessage);
      } catch (error) {
        console.error('Error al guardar mensaje:', error);
      }
    });

    // Respuesta a un mensaje
    socket.on('sendReply', async ({ messageId, reply, userId, name, avatar }) => {
      try {
        const newReply = await messagesModel.saveReplyToMessage(messageId, userId, reply, name, avatar);
        const updatedMessages = await messagesModel.getMessagesWithReplies();
        io.emit('newReply', updatedMessages.find(m => m.id === messageId));
      } catch (error) {
        console.error('Error al guardar respuesta:', error.message);
      }
    });
    
    

    socket.on('disconnect', () => {
      // Usuario desconectado
    });
  });
};
