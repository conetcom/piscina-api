const eventsModel = require('../models/eventsModel');

const getEvents = async (req, res) => {
  try {
    const events = await eventsModel.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

const createEvent = async (req, res) => {
  try {
    const newEvent = await eventsModel.createEvent(req.body);
    
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
};

const updateEvent = async (req, res) => {
   try {
     const id = parseInt(req.params.id, 10); // convierte a entero seguro
     console.log(id);
    const updatedEvent = await eventsModel.updateEvent(id, req.body);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // convierte a entero seguro
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await eventsModel.deleteEvent(id);
    res.status(204).end(); // Eliminado con éxito
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
};


module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
