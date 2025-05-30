const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

router.get('/', eventsController.getEvents);
router.post('/', eventsController.createEvent);
router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

router.put('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;

