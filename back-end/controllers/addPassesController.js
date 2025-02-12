const fs = require('fs');
const path = require('path');
const addPassesService = require('../services/addPassesService');

exports.addPasses = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'failed', info: 'No file uploaded' });
    }

    const destinationPath = path.join('C:/ProgramData/MySQL/MySQL Server 8.0/Uploads', req.file.originalname);

    fs.copyFileSync(req.file.path, destinationPath);

    fs.unlinkSync(req.file.path);

    await addPassesService.addPasses(destinationPath);

    res.status(200).json({ status: 'OK', info: 'Data successfully imported' });
  } catch (error) {
    console.error('Error adding passes:', error.message);
    res.status(500).json({ status: 'failed', info: error.message });
  }
};
