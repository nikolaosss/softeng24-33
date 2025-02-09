const express = require('express');
const router = express.Router();
const resetStationsController = require('../../controllers/resetStationsController');

router.post('/resetstations', resetStationsController.resetStations);

module.exports = router;
