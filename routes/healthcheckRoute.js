const express = require('express');
const router = express.Router();
const healthcheckController = require('../controllers/healthcheckController');

router.get('/healthcheck', healthcheckController.check);

module.exports = router;
