const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const healthcheckRoute = require('./routes/healthcheckRoute');
const resetStationsRoute = require('./routes/resetStationsRoute');
const resetPassesRoute = require('./routes/resetPassesRoute');
const addPassesRoute = require('./routes/addPassesRoute');
const tollStationPassesRoute = require('./routes/tollStationPassesRoute');
const passAnalysisRoute = require('./routes/passAnalysisRoute');
const passesCostRoute = require('./routes/passesCost');
const chargesByRoute = require('./routes/chargesBy');
const routes = require('./routes/routes');
const debtsRoute = require("./routes/debtsRoute");

const app = express();

app.use(cors({ origin: 'http://localhost:9600' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', healthcheckRoute);
app.use('/admin', resetStationsRoute);
app.use('/admin', resetPassesRoute);
app.use('/admin', addPassesRoute);
app.use('/api', tollStationPassesRoute);
app.use('/api', passAnalysisRoute);
app.use('/api', passesCostRoute);
app.use('/api', chargesByRoute);
app.use('/api', routes);
app.use("/api/debts", debtsRoute);
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
