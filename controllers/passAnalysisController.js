const passAnalysisService = require('../services/passAnalysisService');

exports.getPassAnalysis = async (req, res) => {
  const { stationOpID, tagOpID, date_from, date_to } = req.params;
  const format = req.query.format || 'json';

  try {
    const data = await passAnalysisService.fetchPassAnalysis(
      stationOpID,
      tagOpID,
      date_from,
      date_to,
      format
    );

    if (format === 'csv') {
      res.header('Content-Type', 'text/csv');
      res.attachment(`pass_analysis_${stationOpID}_${tagOpID}.csv`);
      res.send(data.csv);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error in getPassAnalysis:', error.message);
    res.status(500).json({ status: 'failed', info: error.message });
  }
};
