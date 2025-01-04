import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* AppBar for Navigation */}
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

      {/* Main Content */}
      <Grid container spacing={3} style={{ padding: '20px' }}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Welcome to the Toll Management System
            </Typography>
            <Typography variant="body1">
              Manage toll interoperability, debts, and analyze data effectively.
            </Typography>
          </Paper>
        </Grid>

        {/* Navigation Options */}
        <Grid item xs={6}>
          <Card onClick={() => navigate('/view-debts')} style={{ cursor: 'pointer' }}>
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/300x140.png?text=View+Debts"
              alt="View Debts"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                View Debts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check and manage outstanding debts between operators.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card onClick={() => navigate('/data-analysis')} style={{ cursor: 'pointer' }}>
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/300x140.png?text=Data+Analysis"
              alt="Data Analysis"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Data Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visualize and analyze toll data for insights and reporting.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
