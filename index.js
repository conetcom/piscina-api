// index.js
const express = require('express');
const http = require('http');
const {Server}= require('socket.io');
const path = require('path');
const cors = require('cors');
const socketController = require('./controllers/socketController'); // Importamos el controlador

// Importamos las rutas
const estadoPiscinas = require('./routes/estadoPiscinasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientroutes');
const messageRoutes = require('./routes/messageRoutes');
// Configuración de CORS

const corsConfig = require('./config/corsConfig');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }, // Permitir conexiones desde cualquier origen
  });

// Llamamos a la función de configuración de socket
socketController(io);

// middleware
app.use(cors(corsConfig));  // Usamos la configuración de CORS
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar las rutas de la aplicación
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/st_piscinas', estadoPiscinas);
app.use('/api/clientes', clientRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/api', (req, res, next) => {
  req.io = io; // 👈 inyectamos io en cada request
  next();
}, messageRoutes);
app.use('/api/user', userRoutes);

// Iniciar el servido
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
