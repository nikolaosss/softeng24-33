const resetStationsService = require('../services/resetStationsService');

exports.resetStations = async (req, res) => {
  try {
    const result = await resetStationsService.resetStations();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error resetting stations:', error.message);
    res.status(500).json({ status: 'failed', info: error.message });
  }
};
