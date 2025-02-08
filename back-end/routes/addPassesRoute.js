const express = require('express');
const router = express.Router();
const addPassesController = require('../../controllers/addPassesController');

router.post('/addpasses', addPassesController.addPasses);

module.exports = router;
