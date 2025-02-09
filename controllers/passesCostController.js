const passesCostService = require('../back-end/services/passesCostService');

exports.getPassesCost = async (req, res) => {
  const { tollOpID, tagOpID, date_from, date_to } = req.params;
  const { format = 'json' } = req.query; 

  try {
    const result = await passesCostService.fetchPassesCost(tollOpID, tagOpID, date_from, date_to, format);

    if (format === 'csv') {
      res.header('Content-Type', 'text/csv');
      res.send(result.csv);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error fetching passes cost:', error.message);
    res.status(500).json({
      status: 'failed',
      info: error.message
    });
  }
};
