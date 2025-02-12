const debtsService = require("../services/debtsService");

exports.getDebts = async (req, res) => {
  const { operatorID, fromDate, toDate } = req.params;

  try {
    const debtsToOthers = await debtsService.calculateDebtsToOthers(operatorID, fromDate, toDate);
    const debtsToMe = await debtsService.calculateDebtsToMe(operatorID, fromDate, toDate);

    res.status(200).json({
      status: "success",
      operatorID,
      fromDate,
      toDate,
      debtsToOthers,
      debtsToMe,
    });
  } catch (error) {
    console.error("Error fetching debts:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
