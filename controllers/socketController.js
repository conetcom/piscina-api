const messagesModel = require('../models/messagesModel');

let users = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Registro de usuario por ID
    socket.on('register', (userId) => {
      users[userId] = socket.id;
    });

    // Enviar mensajes anteriores desde la base de datos
    socket.on('requestPreviousMessages', async () => {
      try {
        const messages = await messagesModel.getMessagesWithReplies();
        socket.emit('previousMessages', messages);
      } catch (error) {
        console.error('Error al obtener mensajes previos:', error);
      }
    });

    // Escuchar nuevos mensajes
    socket.on('sendMessage', async ({ from, content }) => {
      try {
        const newMessage = await messagesModel.saveMessages(content, from);
        io.emit('newMessage', newMessage); // Emitir a todos los clientes
      } catch (error) {
        console.error('Error al guardar mensaje:', error);
      }
    });

    // Escuchar respuestas
    socket.on('sendReply', async ({ messageId, reply, userId }) => {
      try {
        await messagesModel.saveReplyToMessage(messageId, userId, reply);
        const updatedMessage = await messagesModel.getMessageByIdWithReplies(messageId);
        io.emit('newReply', updatedMessage); // Emitir mensaje con respuestas actualizadas
      } catch (error) {
        console.error('Error al guardar respuesta:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });
};
