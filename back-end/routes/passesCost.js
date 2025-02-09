const express = require('express');
const router = express.Router();
const passesCostController = require('../../controllers/passesCostController');

router.get('/passesCost/:tollOpID/:tagOpID/:date_from/:date_to', passesCostController.getPassesCost);

module.exports = router;
