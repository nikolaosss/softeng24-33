const express = require('express');
const passAnalysisController = require('../controllers/passAnalysisController');
const { authMiddleware } = require('../authMiddleware'); 
const { authorizeRole } = require('../authorizeRole'); 

const router = express.Router();

router.get(
    '/passAnalysis/:stationOpID/:tagOpID/:date_from/:date_to',
    authMiddleware, 
    authorizeRole(['ADMIN', 'OPERATOR']), 
    passAnalysisController.getPassAnalysis 
);

module.exports = router;
