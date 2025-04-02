// config/corsConfig.js
module.exports = {
    origin: "*", // Permite cualquier dominio
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true // ⚠️ NO usar true con "*" por seguridad
  };
  