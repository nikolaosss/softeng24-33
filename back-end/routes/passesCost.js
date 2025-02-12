const express = require('express');
const router = express.Router();
const passesCostController = require('../controllers/passesCostController');
const { authMiddleware } = require('../authMiddleware'); 
const { authorizeRole } = require('../authorizeRole'); 

router.get(
    '/passesCost/:tollOpID/:tagOpID/:date_from/:date_to',
    authMiddleware, 
    authorizeRole(['ADMIN', 'OPERATOR']), 
    passesCostController.getPassesCost 
);

module.exports = router;
