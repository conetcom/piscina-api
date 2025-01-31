const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Permitir peticiones desde tu frontend
    credentials: true, // Habilitar cookies si las usas
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Headers permitidos
  }));
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

