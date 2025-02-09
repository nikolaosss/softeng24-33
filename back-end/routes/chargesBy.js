const express = require('express');
const router = express.Router();
const chargesByController = require('../../controllers/chargesByController');

router.get('/chargesBy/:tollOpID/:date_from/:date_to', chargesByController.getChargesBy);

module.exports = router;
