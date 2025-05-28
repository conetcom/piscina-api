const db = require('./database'); // Ajusta esto a tu instancia de conexión

const getAllEvents = async () => {
  const result = await db.query('SELECT * FROM events ORDER BY start');
  return result.rows;
};

const createEvent = async (event) => {
  const { title, start, fin, category } = event;
  const result = await db.query(
    'INSERT INTO events (title, start, fin, category) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, start, fin, category]
  );
  return result.rows[0];
};

const updateEvent = async (id, event) => {
  const { title, start, fin, category} = event;
  const result = await db.query(
    'UPDATE events SET title = $1, start = $2, fin = $3, 4 = category WHERE id = $5 RETURNING *',
    [title, start, fin, category, id]
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
