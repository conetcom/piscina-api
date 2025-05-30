const db = require('./database'); // Ajusta esto a tu instancia de conexión


const getAllEvents = async (userId) => {
  console.log("Desde el modelo, userId recibido:", userId); // <- Aquí se vuelve undefined?
  if (!userId) throw new Error("userId no proporcionado al modelo");

  const result = await db.query(
    'SELECT * FROM events WHERE user_id = $1 ORDER BY start',
    [userId]
  );
  return result.rows;
};

const createEvent = async (eventData, userId) => {
  const { title, start, fin, className } = eventData;
  const category = className;
console.log('estos son los datos',eventData, userId);
  const result = await db.query(
    'INSERT INTO events (title, start, fin, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, start, fin, category, userId]
  );

  return result.rows[0];
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
