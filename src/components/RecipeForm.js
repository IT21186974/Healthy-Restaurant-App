import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    const [cookingTime, setCookingTime] = useState('');
    const [category, setCategory] = useState('');
    const [dietaryPreference, setDietaryPreference] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!description) newErrors.description = 'Description is required';
        if (!ingredients) newErrors.ingredients = 'Ingredients are required';
        if (!instructions) newErrors.instructions = 'Instructions are required';
        if (!cookingTime || isNaN(cookingTime) || cookingTime <= 0) newErrors.cookingTime = 'Cooking time must be a positive number';
        if (!category) newErrors.category = 'Category is required';
        if (!dietaryPreference) newErrors.dietaryPreference = 'Dietary preference is required';
        if (!image) newErrors.image = 'Image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('ingredients', ingredients.split(',').map(ingredient => ingredient.trim()));
        formData.append('instructions', instructions);
        formData.append('cookingTime', cookingTime);
        formData.append('category', category);
        formData.append('dietaryPreference', dietaryPreference);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('http://localhost:5000/api/recipes', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/profile');
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    const handleClear = () => {
        setTitle('');
        setDescription('');
        setIngredients('');
        setInstructions('');
        setImage(null);
        setCookingTime('');
        setCategory('');
        setDietaryPreference('');
        setErrors({});
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px', backgroundColor: '#fff8e1', padding: '20px', borderRadius: '8px' }}>
            <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#fff3e0' }}>
                <Typography variant="h4" align="center" gutterBottom style={{ color: '#ff8f00' }}>
                    Add New Recipe
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                error={!!errors.title}
                                helperText={errors.title || ' '}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fffde7',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                error={!!errors.description}
                                helperText={errors.description || ' '}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fffde7',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ingredients (comma separated)"
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                required
                                error={!!errors.ingredients}
                                helperText={errors.ingredients || ' '}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fffde7',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                required
                                multiline
                                rows={4}
                                variant="outlined"
                                error={!!errors.instructions}
                                helperText={errors.instructions || ' '}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fffde7',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Cooking Time (in minutes)"
                                type="number"
                                value={cookingTime}
                                onChange={(e) => setCookingTime(e.target.value)}
                                required
                                error={!!errors.cookingTime}
                                helperText={errors.cookingTime || ' '}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fffde7',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                error={!!errors.category}
                                helperText={errors.category || ' '}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fffde7',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Dietary Preference"
                                value={dietaryPreference}
                                onChange={(e) => setDietaryPreference(e.target.value)}
                                required
                                placeholder="e.g., Vegan, Vegetarian, Gluten-Free"
                                error={!!errors.dietaryPreference}
                                helperText={errors.dietaryPreference || ' '}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fffde7',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                required
                                style={{ marginTop: '16px' }}
                            />
                            {errors.image && <div style={{ color: 'red' }}>{errors.image}</div>}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                style={{ backgroundColor: '#ffbc00', color: '#000000', marginTop: '20px' }}
                                fullWidth
                            >
                                Add Recipe
                            </Button>
                            <Button
                                type="button"
                                onClick={handleClear}
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{ backgroundColor: '#717274', color: '#ffffff', marginTop: '10px' }}
                            >
                                Clear
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCancel}
                                variant="contained"
                                color="error"
                                fullWidth
                                style={{ marginTop: '10px' }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default RecipeForm;
