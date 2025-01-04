const express = require('express');
const passAnalysisController = require('../controllers/passAnalysisController');

const router = express.Router();

router.get('/passAnalysis/:stationOpID/:tagOpID/:date_from/:date_to', passAnalysisController.getPassAnalysis);

module.exports = router;
