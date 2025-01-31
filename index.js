const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');


const app = express();


// middleware
app.use(cors({
  origin: "https://frontend-piscinas.onrender.com", // Cambia por la URL de tu frontend en Render
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true // Si usas cookies o autenticación basada en sesiones
}));

app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

