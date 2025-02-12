const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/paymentsController");

// POST για πληρωμή χρέους
router.post("/pay-debt", paymentsController.payDebt);

// GET για ιστορικό συναλλαγών
router.get("/transactions/:operatorID", paymentsController.getTransactionHistory);

module.exports = router;
