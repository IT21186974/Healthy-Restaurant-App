import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Button, TextField, Typography, Container, Paper } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { CancelOutlined } from '@mui/icons-material';

const Login = () => {
    const { setUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });
    
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            setUser({ username: response.data.username });
            navigate('/profile');
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid username or password.');
        }
    };
    
    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Container component={Paper} elevation={3} maxWidth="sm" style={{ padding: '20px', marginTop: '50px' }}>
            <Typography variant="h5" align="center" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField 
                    label="Username" 
                    variant="outlined" 
                    fullWidth 
                    margin="normal" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <TextField 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    fullWidth 
                    margin="normal" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                {error && <Typography color="error" align="center">{error}</Typography>}
                <br></br><br></br>
                <Button 
                    type="submit" 
                    variant="contained" 
                    style={{ backgroundColor: '#ffbc00', color: '#000000', marginTop: '20px' }}
                    fullWidth 
                    startIcon={<Lock />}
                >
                    Login
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleCancel} 
                    fullWidth 
                    style={{ backgroundColor: '#717274', color: '#ffffff', marginTop: '10px' }}
                    startIcon={<CancelOutlined />}
                >
                    Cancel
                </Button>
                <br></br><br></br>
            </form>
        </Container>
    );
};

export default Login;
