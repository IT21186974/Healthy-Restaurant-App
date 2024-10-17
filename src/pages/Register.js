import React, { useState, useContext } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { AccountCircle, CancelOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
            //alert(res.message);
            console.log(res, "msg");
            
            // Set the user context
            setUser({ username });

            navigate('/login');
        } catch (error) {
            console.error('Error registering:', error);
            alert('Registration failed. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Container component={Paper} elevation={3} maxWidth="sm" style={{ padding: '20px', marginTop: '50px' }}>
            <Typography variant="h5" align="center" gutterBottom>
                Register
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
                    label="Email" 
                    variant="outlined" 
                    fullWidth 
                    margin="normal" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
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
                <br></br><br></br>
                <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    style={{ backgroundColor: '#ffbc00', color: '#000000', marginTop: '20px' }}
                    startIcon={<AccountCircle />}
                >
                    Register
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

export default Register;
