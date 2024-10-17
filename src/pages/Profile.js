import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, Typography, Container, Paper, TextField, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import RecipeReport from '../components/RecipeReport';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/recipes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecipes(response.data);
                setFilteredRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        if (user) {
            fetchRecipes();
        }
    }, [user]);

    const handleDelete = (id) => {
        setRecipes(recipes.filter(recipe => recipe._id !== id));
        setFilteredRecipes(filteredRecipes.filter(recipe => recipe._id !== id));
    };

    const handleSearch = () => {
        const filtered = recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRecipes(filtered);
    };

    const handleReset = () => {
        setSearchTerm('');
        setFilteredRecipes(recipes);
    };

    return (
        <Container component={Paper} elevation={3} style={{ padding: '20px', marginTop: '30px' }}>
            <Typography variant="h4" align="center" gutterBottom marginBottom={5}>
                Welcome {user?.username}!
            </Typography>

            {/* Grid for Search Bar, Generate Report Button, and Add Recipe Button */}
            <Grid 
                container 
                justifyContent="space-between" 
                alignItems="center" 
                style={{ 
                    marginBottom: '30px', 
                    backgroundColor: '#f0f0f0',
                    padding: '15px',
                    borderRadius: '8px'
                }}
            >
                <Grid item xs={5} style={{ paddingRight: '10px' }}>
                    <TextField
                        fullWidth
                        label="Search Recipes"
                        variant="standard"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch} color="primary">
                                        <SearchIcon />
                                    </IconButton>
                                    {searchTerm && (
                                        <IconButton onClick={handleReset} color="error">
                                            <ClearIcon />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid item>
                    <RecipeReport user={user} filteredRecipes={filteredRecipes} />
                    <>&nbsp;</>
                    <Button 
                        variant="contained" 
                        style={{ backgroundColor: '#ffce00', color: '#000000'}}
                        onClick={() => navigate('/add-recipe')}
                    >
                        Add Recipe
                    </Button>
                </Grid>
            </Grid>

            {/* Recipes List */}
            <Grid container spacing={3}>
                {filteredRecipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                        <RecipeCard 
                            recipe={recipe} 
                            onDelete={handleDelete} 
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Profile;
