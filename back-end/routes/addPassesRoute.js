const express = require('express');
const multer = require('multer');
const addPassesController = require('../controllers/addPassesController');
const { authMiddleware } = require('../authMiddleware'); 
const { authorizeRole } = require('../authorizeRole'); 

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post(
    '/addpasses',
    authMiddleware,
    authorizeRole(['ADMIN']), 
    upload.single('csvFile'),
    addPassesController.addPasses 
);

module.exports = router;
