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

  const backgroundStyle = {
    backgroundImage: 'url("https://i.redd.it/q95kad030uv71.jpg")', // Replace with your image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100%',
    overflow: 'auto',
  };

  return (
    <div style={backgroundStyle}>
      {/* Main Content */}
      <Grid container spacing={3} style={{ padding: '20px' }}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // Transparent white
            }}
          >
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
          <Card onClick={() => navigate('/view-debts')} style={{ cursor: 'pointer',       backgroundColor: 'rgba(255, 255, 255, 0.9)', // Transparent white 
          }}>
            <CardMedia
              component="img"
              height="140"
              image="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9uZXl8ZW58MHx8MHx8fDA%3D"
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
          <Card onClick={() => navigate('/data-analysis')} style={{ cursor: 'pointer',              backgroundColor: 'rgba(255, 255, 255, 0.9)', // Transparent white
             }}>
            <div style={{
              height: '140px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <CardMedia
                component="img"
                style={{
                  objectFit: 'cover',
                  width: '180%',
                }}
                image="https://images.squarespace-cdn.com/content/v1/55b6a6dce4b089e11621d3ed/9ad7e5df-ee31-4764-81ad-26bef16ff3c3/Line+graph+without+gridlines.png"
                alt="Data Analysis"
              />
            </div>
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
