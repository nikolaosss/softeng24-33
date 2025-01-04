const dbConnection = require('../models/db');

exports.resetPasses = async () => {
  await dbConnection.query('SET FOREIGN_KEY_CHECKS=0');
  await dbConnection.query('DELETE FROM PASSES');
  await dbConnection.query('DELETE FROM DEBTS_PER_STATION');
  await dbConnection.query('DELETE FROM PAYMENTS');
  await dbConnection.query('SET FOREIGN_KEY_CHECKS=1');
  return { status: 'OK' };
};
