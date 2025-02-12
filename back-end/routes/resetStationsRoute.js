const express = require('express');
const router = express.Router();
const resetStationsController = require('../controllers/resetStationsController');
const { authMiddleware } = require('../authMiddleware'); 
const { authorizeRole } = require('../authorizeRole'); 

router.post('/resetstations', authMiddleware, authorizeRole(['ADMIN']), resetStationsController.resetStations);

module.exports = router;
