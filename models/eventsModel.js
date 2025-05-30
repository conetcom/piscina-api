const db = require('./database'); // Ajusta esto a tu instancia de conexión

const getAllEvents = async (req, res) => {
  const userId = req.user?.id;
console.log('este es el codigo de usuario' , userId);
  if (!userId) {
    return res.status(401).json({ error: "No autorizado: ID de usuario no disponible" });
  }

  try {
    const result = await db.query(
      'SELECT * FROM events WHERE user_id = $1 ORDER BY start',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener eventos:", err);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
};



const createEvent = async (req, res) => {
  const userId = req.user.id; // desde el token
  const { title, start, fin, className } = req.body;
  const category = className; // 👈 renombramos para que coincida con el campo de la BD

  try {
    const result = await db.query(
      'INSERT INTO events (title, start, fin, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, start, fin, category, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al crear evento" });
  }
};

const updateEvent = async (id, event) => {
  const { title, start, fin, className } = event;

  const result = await db.query(
    'UPDATE events SET title = $1, start = $2, fin = $3, category = $4 WHERE id = $5 RETURNING *',
    [title, start, fin, className, id]
  );

  return result.rows[0];
};


const deleteEvent = async (id) => {
  await db.query('DELETE FROM events WHERE id = $1', [id]);
};

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
