const express = require('express');
const router = express.Router();
const resetPassesController = require('../../controllers/resetPassesController');

router.post('/resetpasses', resetPassesController.resetPasses);

module.exports = router;
