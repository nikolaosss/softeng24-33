const express = require('express');
const bodyParser = require('body-parser');

const healthcheckRoute = require('./routes/healthcheckRoute');
const resetStationsRoute = require('./routes/resetStationsRoute');
const resetPassesRoute = require('./routes/resetPassesRoute');
const addPassesRoute = require('./routes/addPassesRoute');
const tollStationPassesRoute = require('./routes/tollStationPassesRoute');
const passAnalysisRoute = require('./routes/passAnalysisRoute');


const app = express();
app.use(bodyParser.json());

app.use('/admin', healthcheckRoute);
app.use('/admin', resetStationsRoute);
app.use('/admin', resetPassesRoute);
app.use('/admin', addPassesRoute);
app.use('/api', tollStationPassesRoute);
app.use('/api', passAnalysisRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
