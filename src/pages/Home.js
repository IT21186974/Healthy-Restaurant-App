import React from 'react';
import { Button, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { Login, AppRegistration } from '@mui/icons-material';
import logo from '../assets/logo.png';

const Home = () => {
    return (
        <Grid 
            container 
            style={{ 
                minHeight: '100vh',
                width: '100%'
            }}
        >
            
            {/* Left half for the logo with light orange background */}
            <Grid 
                item xs={12} md={6} 
                style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    backgroundColor: '#f1f0f0',
                }}
            >
                <img 
                    src={logo} 
                    alt="Wellness Kitchen Logo" 
                    style={{ 
                        maxWidth: '80%',
                        height: 'auto',
                        objectFit: 'contain'
                    }} 
                />
            </Grid>
            {/* Right half for text and buttons */}
            <Grid 
                item xs={12} md={6} 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                }}
            >
                <Typography variant="h3" align="center" gutterBottom>
                    Welcome to <br></br> WELLNESS KITCHEN
                </Typography>
                <br></br><br></br>
                <Typography variant="h6" align="center" gutterBottom>
                    Please choose an option:
                </Typography>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <Button 
                        variant="contained" 
                        style={{ backgroundColor: '#ffbc00', color: '#000000', textTransform: 'none' }} 
                        component={Link} 
                        to="/login" 
                        startIcon={<Login />}
                    >
                        Login
                    </Button>
                    <Button 
                        variant="outlined" 
                        style={{ borderColor: '#ffbc00', color: '#000000', textTransform: 'none' }} 
                        component={Link} 
                        to="/register" 
                        startIcon={<AppRegistration />}
                    >
                        Register
                    </Button>
                </div>
            </Grid>
        </Grid>
    );
};

export default Home;
