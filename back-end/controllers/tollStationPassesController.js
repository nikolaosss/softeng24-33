const tollStationPassesService = require('../services/tollStationPassesService');

exports.getTollStationPasses = async (req, res) => {
  const { tollStationID, date_from, date_to } = req.params;

  try {
    const response = await tollStationPassesService.fetchPasses(tollStationID, date_from, date_to);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching toll station passes:', error.message);
    res.status(500).json({
      status: 'failed',
      info: error.message,
    });
  }
};
