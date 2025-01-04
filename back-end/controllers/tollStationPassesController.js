const tollStationPassesService = require('../services/tollStationPassesService');

exports.getTollStationPasses = async (req, res) => {
  const { tollStationID, date_from, date_to } = req.params;
  const format = req.query.format || 'json';

  try {
    const response = await tollStationPassesService.fetchPasses(tollStationID, date_from, date_to, format);

    if (format === 'csv') {
      res.header('Content-Type', 'text/csv');
      res.attachment(`toll_station_passes_${tollStationID}_${date_from}_${date_to}.csv`);
      res.send(response.csv);
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    console.error('Error fetching toll station passes:', error.message);
    res.status(500).json({
      status: 'failed',
      info: error.message,
    });
  }
};
