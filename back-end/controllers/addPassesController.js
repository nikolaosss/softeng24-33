const addPassesService = require('../services/addPassesService');

exports.addPasses = async (req, res) => {
  try {
    const result = await addPassesService.addPasses();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding passes:', error.message);
    res.status(500).json({ status: 'failed', info: error.message });
  }
};
