import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Person, ExitToApp, Login, AppRegistration, Loyalty } from '@mui/icons-material';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <AppBar position="static" style={{ backgroundColor: '#ffce00' }}>
            <Toolbar style={{ minHeight: '65px' }}>
                <Typography variant="h6" style={{ flexGrow: 1, color: '#000000' }}>
                    Wellness Kitchen
                </Typography>
                {user ? (
                    <>
                        <IconButton 
                            color="inherit" 
                            style={{ color: '#000000' }}
                            component={Link} 
                            to="/recipe-wall"
                        >
                            <Loyalty />
                        </IconButton>
                        <IconButton 
                            color="inherit" 
                            component={Link} 
                            to="/profile" 
                            style={{ color: '#000000' }}
                        >
                            <Person />
                        </IconButton>
                        <IconButton 
                            color="inherit" 
                            onClick={handleLogout} 
                            style={{ color: '#000000' }}
                        >
                            <ExitToApp />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <IconButton 
                            color="inherit" 
                            component={Link} 
                            to="/register" 
                            style={{ color: '#000000' }}
                        >
                            <AppRegistration />
                        </IconButton>
                        <IconButton 
                            color="inherit" 
                            component={Link} 
                            to="/login" 
                            style={{ color: '#000000' }}
                        >
                            <Login />
                        </IconButton>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
