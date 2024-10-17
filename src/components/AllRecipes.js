import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Grid, IconButton, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UpvoteIcon from '@mui/icons-material/ThumbUp';
import DownvoteIcon from '@mui/icons-material/ThumbDown';

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userVotes, setUserVotes] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        }

        const fetchRecipes = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/recipes/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecipes(res.data);
                // Initialize userVotes with all recipes set to 0 (no vote)
                const initialVotes = {};
                res.data.forEach(recipe => {
                    initialVotes[recipe._id] = 0; // 0 means no vote
                });
                setUserVotes(initialVotes);
            } catch (err) {
                console.error('Error fetching recipes:', err);
                setError('Failed to fetch recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [navigate]);

    const handleUpvote = async (id) => {
        const token = localStorage.getItem('token');
        if (userVotes[id] === 1) {
            // Already upvoted
            setSnackbarMessage('You have already upvoted this recipe!');
            setSnackbarOpen(true);
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/api/recipes/votes/upvote/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRecipes((prevRecipes) => 
                prevRecipes.map((recipe) => 
                    recipe._id === id ? { ...recipe, votes: recipe.votes + 1, userVote: 1 } : recipe
                )
            );
            setUserVotes((prevVotes) => ({ ...prevVotes, [id]: 1 }));
            setSnackbarMessage(res.data.message);
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Error upvoting recipe:', err);
            setSnackbarMessage(err.response?.data?.message || 'Error upvoting recipe');
            setSnackbarOpen(true);
        }
    };

    const handleDownvote = async (id) => {
        const token = localStorage.getItem('token');
        if (userVotes[id] === -1) {
            // Already downvoted
            setSnackbarMessage('You have already downvoted this recipe!');
            setSnackbarOpen(true);
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/api/recipes/votes/downvote/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRecipes((prevRecipes) => 
                prevRecipes.map((recipe) => 
                    recipe._id === id ? { ...recipe, votes: recipe.votes - 1, userVote: -1 } : recipe 
                )
            );
            setUserVotes((prevVotes) => ({ ...prevVotes, [id]: -1 }));
            setSnackbarMessage(res.data.message);
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Error downvoting recipe:', err);
            setSnackbarMessage(err.response?.data?.message || 'Error downvoting recipe');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom align="center" marginTop={5} marginBottom={5}>
                Check the most voted recipes!
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {recipes.map((recipe, index) => (
                    <Grid item xs={12} sm={8} md={6} key={recipe._id}>
                        <Paper 
                            style={{ 
                                padding: '16px', 
                                marginBottom: '16px', 
                                borderRadius: '8px', 
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
                                transition: '0.3s',
                                backgroundColor: index === 0 ? '#FFFAE3' : '#E0F7E0',
                                border: index === 0 ? '2px solid #FFD600' : 'none', 
                            }} 
                            elevation={3}
                        >
                            {index === 0 && <Typography variant="body2" color="primary" style={{ fontWeight: 'bold' }}>Top Voted Recipe!</Typography>}
                            
                            {/* Recipe Image */}
                            {recipe.image && (
                                <img 
                                    src={`http://localhost:5000/${recipe.image}`} 
                                    alt={recipe.title} 
                                    style={{ width: '100%', height: 'auto', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc' }} 
                                />
                            )}

                            <Typography variant="h6" style={{ marginBottom: '8px', color: '#333' }}>{recipe.title}</Typography>
                            <Typography variant="body2" style={{ marginBottom: '8px', color: '#666' }}>{recipe.description}</Typography>
                            <Typography variant="body2"><strong>Cooking Time:</strong> {recipe.cookingTime} mins</Typography>
                            <Typography variant="body2"><strong>Category:</strong> {recipe.category}</Typography>
                            <Typography variant="body2"><strong>Dietary Preference:</strong> {recipe.dietaryPreference}</Typography>
                            <Typography variant="body2"><strong>Votes:</strong> {recipe.votes}</Typography>
                            
                            {/* Position Icons */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <IconButton 
                                    style={{ color: '#FFEA00' }}
                                    onClick={() => handleUpvote(recipe._id)} 
                                    disabled={userVotes[recipe._id] === 1}
                                >
                                    <UpvoteIcon />
                                </IconButton>
                                <IconButton 
                                    style={{ color: '#D32F2F', marginLeft: '8px' }}
                                    onClick={() => handleDownvote(recipe._id)}
                                    disabled={userVotes[recipe._id] === -1}
                                >
                                    <DownvoteIcon />
                                </IconButton>
                            </div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default AllRecipes;
