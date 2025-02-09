const resetPassesService = require('../back-end/services/resetPassesService');

exports.resetPasses = async (req, res) => {
  try {
    const result = await resetPassesService.resetPasses();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error resetting passes:', error.message);
    res.status(500).json({ status: 'failed', info: error.message });
  }
};
