import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  // State για φίλτρα
  const [tollStationID, setTollStationID] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [data, setData] = useState([]);

  // Δείγμα δεδομένων σταθμών διοδίων
  const tollStations = [
    { id: 'NAO07', name: 'NAO07' },
  ];

  // Λειτουργία για κλήση API
  const fetchData = async () => {
    try {
      // Remove dashes from the dates
      const formattedDateFrom = dateFrom.replace(/-/g, ''); // Converts "2023-01-01" to "20230101"
      const formattedDateTo = dateTo.replace(/-/g, ''); // Converts "2023-01-31" to "20230131"
  
      const response = await axios.get(
        `http://localhost:3001/api/tollStationPasses/${tollStationID}/${formattedDateFrom}/${formattedDateTo}`
      );
      const rawData = response.data.passList;
  
      // Group data by date
      const groupedData = rawData.reduce((acc, pass) => {
        const date = pass.timestamp.split('T')[0]; // Extract date from timestamp
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      // Convert grouped data to chart-compatible format
      const chartData = Object.entries(groupedData).map(([date, count]) => ({
        date,
        count,
      }));
  
      setData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <div>
      {/* AppBar για Navigation */}
      <AppBar position="static" style={{ marginBottom: '20px' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CONNECT.OLL
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/view-debts')}>View Debts</Button>
          <Button color="inherit" onClick={() => navigate('/data-analysis')}>Data Analysis</Button>
        </Toolbar>
      </AppBar>

      {/* Φίλτρα */}
      <Grid container spacing={3} style={{ padding: '20px' }}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Select Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  select
                  label="Toll Station"
                  value={tollStationID}
                  onChange={(e) => setTollStationID(e.target.value)}
                  fullWidth
                >
                  {tollStations.map((station) => (
                    <MenuItem key={station.id} value={station.id}>
                      {station.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Date From"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Date To"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
              onClick={fetchData}
            >
              Fetch Data
            </Button>
          </Paper>
        </Grid>

        {/* Γράφημα */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Number of Passes per Day
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
