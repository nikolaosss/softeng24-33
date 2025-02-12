const express = require('express');
const router = express.Router();
const debtsService = require('../services/debtsService'); // Βεβαιώσου ότι το path είναι σωστό!

router.get("/:operator/:fromDate/:toDate", async (req, res) => {
  try {
    const { operator, fromDate, toDate } = req.params;
    
    console.log(`Fetching debts for operator: ${operator}, from ${fromDate} to ${toDate}`);

    // Υπολογισμός χρεών
    const debtsToOthers = await debtsService.calculateDebtsToOthers(operator, fromDate, toDate);
    const debtsToMe = await debtsService.calculateDebtsToMe(operator, fromDate, toDate);

    res.json({
      debtsToOthers,
      debtsToMe
    });
  } catch (error) {
    console.error("Error fetching debts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
