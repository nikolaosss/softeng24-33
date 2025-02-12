const express = require('express');
const router = express.Router();
const chargesByController = require('../controllers/chargesByController');
const { authMiddleware } = require('../authMiddleware'); 
const { authorizeRole } = require('../authorizeRole'); 

router.get(
    '/chargesBy/:tollOpID/:date_from/:date_to',
    authMiddleware, 
    authorizeRole(['ADMIN', 'OPERATOR']), 
    chargesByController.getChargesBy 
);

module.exports = router;
