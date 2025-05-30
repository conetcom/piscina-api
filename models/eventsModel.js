const db = require('./database'); // Ajusta esto a tu instancia de conexión

const getAllEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await db.query(
      'SELECT * FROM events WHERE user_id = $1  ORDER BY start',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener eventos" });
  }
};

const createEvent = async (req, res) => {
  const userId = req.user.id; // desde el token
  const { title, start, fin, className } = req.body;
  

  try {
    const result = await db.query(
      'INSERT INTO events (title, start, fin, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, start, fin, className, userId]
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
