const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');


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
const paymentsRoute = require("./routes/paymentsRoute");

const app = express();


// Φόρτωση των SSL/TLS Certificates
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
};


app.use(cors({ origin: 'http://localhost:9600' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/admin', healthcheckRoute);
app.use('/api/admin', resetStationsRoute);
app.use('/api/admin', resetPassesRoute);
app.use('/api/admin', addPassesRoute);
app.use('/api', tollStationPassesRoute);
app.use('/api', passAnalysisRoute);
app.use('/api', passesCostRoute);
app.use('/api', chargesByRoute);
app.use('/api', routes);
app.use("/api", paymentsRoute);
app.use("/api/debts", debtsRoute);

const PORT = 3001;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running securely on https://localhost:${PORT}`);
});
