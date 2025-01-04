const express = require('express');
const router = express.Router();
const tollStationPassesController = require('../controllers/tollStationPassesController');

router.get('/tollStationPasses/:tollStationID/:date_from/:date_to', tollStationPassesController.getTollStationPasses);

module.exports = router;
