import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { List, ListItem, ListItemText, Typography, Container, Paper, TextField } from '@mui/material';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useContext(AuthContext);

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
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        if (user) {
            fetchRecipes();
        }
    }, [user]);

    // Function to handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filtered recipes based on the search query or return all recipes if searchQuery is empty
    const filteredRecipes = searchQuery
        ? recipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.ingredients.some(ingredient =>
                ingredient.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        : recipes;

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center" style={{ color: '#4caf50' }}>
                Your Recipes
            </Typography>
            
            <form>
                {/* Search Input */}
                <TextField
                variant="outlined"
                placeholder="Search recipes..."
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginBottom: '16px' }}
            />

            </form>
            
            <Paper elevation={3} style={{ padding: '16px' }}>
                <List>
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <ListItem key={recipe._id}>
                                <ListItemText
                                    primary={recipe.title}
                                    secondary={`Ingredients: ${recipe.ingredients.join(', ')}`}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body1" align="center">
                            {searchQuery ? "No recipes found for your search." : "No recipes available."}
                        </Typography>
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default RecipeList;
