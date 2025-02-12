const express = require('express');
const router = express.Router();
const healthcheckController = require('../controllers/healthcheckController');
const { authMiddleware } = require('../authMiddleware');
const { authorizeRole } = require('../authorizeRole'); 

router.get('/healthcheck', authMiddleware, authorizeRole(['ADMIN']), healthcheckController.check);

module.exports = router;
