// src/controllers/socketController.js
let users = {}; // Aquí guardamos las conexiones de usuario

module.exports = (io) => {
    let messages = []; // Almacenamiento temporal de mensajes
    io.on('connection', (socket) => {
        console.log('Nuevo usuario conectado');
  // Enviar mensajes anteriores al usuario nuevo
    
  socket.emit('previousMessages', messages);

        // Guardar la conexión del usuario
        socket.on('register', (userId) => {
            users[userId] = socket.id; // Asociar el userId con su socket
        });

        // Escuchar el mensaje y enviarlo al usuario destino
        socket.on('sendMessage', (message) => {
            const { to, from, content } = message;
            const targetSocketId = users[to];

            if (targetSocketId) {
                // Enviar el mensaje al usuario destino
                io.to(targetSocketId).emit('receiveMessage', { from, content });
            }
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });
};
