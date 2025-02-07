const express = require('express');
const cors = require('cors');
const estadoPiscinas = require('./routes/st_piscinasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');


const app = express();


// middleware
app.use(cors({
  origin: "*", // Permite cualquier dominio
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true // ⚠️ NO usar true con "*" por seguridad
}));

app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/st_piscinas', estadoPiscinas);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

