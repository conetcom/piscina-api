let users = {}; // Aquí guardamos las conexiones de usuario
let messages = []; // Almacenamiento temporal de mensajes

module.exports = (io) => {
    io.on('connection', (socket) => {
        
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
            
            // Si el usuario está conectado
            if (targetSocketId) {
                // Enviar el mensaje al usuario destino
                io.to(targetSocketId).emit('receiveMessage', { from, content });
                
                // Almacenar el mensaje en la memoria
                const newMessage = {
                    id: Date.now(), // Puedes usar un id temporal aquí
                    user_id: from,  // Id del usuario que envía el mensaje
                    messages: content,
                    created_at: new Date().toISOString(),
                    users: from,  // O el nombre del usuario
                    usuarios: from,  // Alias o nombre del usuario
                    replies: [] // No tiene respuestas por ahora
                };
//console.log(newMessage);
                messages.push(newMessage); // Almacenar el mensaje en el arreglo de mensajes

                // Emitir el mensaje a todos los clientes conectados (en caso de que necesiten verlo)
                io.emit('newMessage', newMessage);
            }
        });

        // Escuchar las respuestas a los mensajes
        socket.on('sendReply', (replyData) => {
            const { messageId, reply, userId } = replyData;

            // Buscar el mensaje original al que se responde
            const messageIndex = messages.findIndex((msg) => msg.id === messageId);

            if (messageIndex !== -1) {
                const originalMessage = messages[messageIndex];

                // Agregar la respuesta al mensaje original
                const newReply = {
                    id: Date.now(), // Crear un ID temporal para la respuesta
                    reply: reply,
                    user_id: userId,
                    created_at: new Date().toISOString()
                };

                originalMessage.replies.push(newReply); // Agregar la respuesta al mensaje

                // Emitir la actualización del mensaje con la nueva respuesta
                io.emit('newReply', { messageId, newReply });
            }
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });
};
