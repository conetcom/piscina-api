const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/register', clientController.registerClient );
router.post('/login', clientController.loginClient);
router.post('/update',clientController.ClientUpdate);


module.exports = router;