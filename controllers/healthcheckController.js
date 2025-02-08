const healthcheckService = require('../back-end/services/healthcheckService');

exports.check = async (req, res) => {
  try {
    const result = await healthcheckService.check(req.query.format);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error during healthcheck:', error.message);
    res.status(500).json({ status: 'failed', info: error.message });
  }
};
