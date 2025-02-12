const express = require('express');
const router = express.Router();
const resetPassesController = require('../controllers/resetPassesController');
const { authMiddleware } = require('../authMiddleware');
const { authorizeRole } = require('../authorizeRole'); 

router.post('/resetpasses', authMiddleware, authorizeRole(['ADMIN']), resetPassesController.resetPasses);

module.exports = router;
