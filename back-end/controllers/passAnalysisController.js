const passAnalysisService = require('../services/passAnalysisService');

exports.getPassAnalysis = async (req, res) => {
  const { stationOpID, tagOpID, date_from, date_to } = req.params;

  try {
    const result = await passAnalysisService.fetchPassAnalysis(stationOpID, tagOpID, date_from, date_to);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching pass analysis:', error.message);
    res.status(500).json({
      status: 'failed',
      info: error.message,
    });
  }
};
