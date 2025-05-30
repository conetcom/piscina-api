const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, eventsController.getEvents);
router.post('/', authMiddleware, eventsController.createEvent);
router.put('/:id', authMiddleware, eventsController.updateEvent);
router.delete('/:id', authMiddleware, eventsController.deleteEvent);

module.exports = router;

