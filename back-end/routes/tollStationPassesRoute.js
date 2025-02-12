const express = require('express');
const router = express.Router();
const tollStationPassesController = require('../controllers/tollStationPassesController');
const { authMiddleware } = require('../authMiddleware'); 
const { authorizeRole } = require('../authorizeRole'); 

router.get(
    '/tollStationPasses/:tollStationID/:date_from/:date_to',
    authMiddleware, 
    authorizeRole(['ADMIN', 'OPERATOR']), 
    tollStationPassesController.getTollStationPasses 
);

module.exports = router;
