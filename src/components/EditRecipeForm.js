import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    TextField, Button, Container, Typography, Paper, 
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';
import { Save, Clear, Cancel } from '@mui/icons-material';

const EditRecipeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({ 
        title: '', 
        description: '', 
        ingredients: [], 
        instructions: '',
        cookingTime: '', 
        category: '', 
        dietaryPreference: ''
    });
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/recipes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const fetchedRecipe = res.data;

                if (typeof fetchedRecipe.ingredients === 'string') {
                    fetchedRecipe.ingredients = fetchedRecipe.ingredients.split(',');
                }

                if (!Array.isArray(fetchedRecipe.ingredients)) {
                    fetchedRecipe.ingredients = [];
                }

                setRecipe(fetchedRecipe);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };

        fetchRecipe();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'ingredients') {
            setRecipe({ ...recipe, ingredients: value.split(',').map(ingredient => ingredient.trim()) });
        } else {
            setRecipe({ ...recipe, [name]: value });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!recipe.title) newErrors.title = 'Title is required';
        if (!recipe.description) newErrors.description = 'Description is required';
        if (recipe.ingredients.length === 0) newErrors.ingredients = 'At least one ingredient is required';
        if (!recipe.instructions) newErrors.instructions = 'Instructions are required';
        if (!recipe.cookingTime || recipe.cookingTime <= 0) newErrors.cookingTime = 'Cooking time must be a positive number';
        if (!recipe.category) newErrors.category = 'Category is required';
        if (!recipe.dietaryPreference) newErrors.dietaryPreference = 'Dietary preference is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setOpen(true);
        }
    };

    const handleConfirmUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/recipes/${id}`, recipe, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/profile');
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
        setOpen(false);
    };

    const handleClear = () => {
        setRecipe({ 
            title: '', 
            description: '', 
            ingredients: [], 
            instructions: '',
            cookingTime: '', 
            category: '', 
            dietaryPreference: ''
        });
        setErrors({});
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px', backgroundColor: '#fff8e1', padding: '20px', borderRadius: '8px' }}>
            <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#fff8e1' }}>
                <Typography variant="h4" gutterBottom align="center" style={{ color: '#ff8f00' }}>
                    Edit Recipe
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        name="title"
                        value={recipe.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={recipe.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <TextField
                        label="Ingredients (comma separated)"
                        name="ingredients"
                        value={recipe.ingredients.join(', ')}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.ingredients}
                        helperText={errors.ingredients}
                    />
                    <TextField
                        label="Cooking Time (in minutes)"
                        name="cookingTime"
                        value={recipe.cookingTime}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        type="number"
                        error={!!errors.cookingTime}
                        helperText={errors.cookingTime}
                    />
                    <TextField
                        label="Category"
                        name="category"
                        value={recipe.category}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.category}
                        helperText={errors.category}
                    />
                    <TextField
                        label="Dietary Preference"
                        name="dietaryPreference"
                        value={recipe.dietaryPreference}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.dietaryPreference}
                        helperText={errors.dietaryPreference}
                    />
                    <TextField
                        label="Instructions"
                        name="instructions"
                        value={recipe.instructions}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        error={!!errors.instructions}
                        helperText={errors.instructions}
                    />
                    <br></br><br></br>
                    
                    <Button
                        type="submit"
                        variant="contained"
                        style={{ backgroundColor: '#ffbc00', color: '#000000', marginRight: '2px', marginBottom: '10px'}}
                        fullWidth
                        startIcon={<Save/>}
                    >
                        Update Recipe
                    </Button>
                    <br></br>
                    <Button
                        type="button"
                        onClick={handleClear}
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ backgroundColor: '#717274', color: '#ffffff', marginRight: '2px', marginBottom: '10px'}}
                        startIcon={<Clear/>}
                    >
                        Clear
                    </Button>
                    <br></br>
                    <Button
                        type="button"
                        onClick={handleCancel}
                        variant="contained"
                        color="error"
                        fullWidth
                        style={{ marginBottom: '10px'}}
                        startIcon={<Cancel/>}
                    >
                        Cancel
                    </Button>
                    <br></br>
                </form>
            </Paper>

            {/* Confirmation Dialog for Updating Recipe */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Update"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to update this recipe? Any changes will be saved.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmUpdate} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EditRecipeForm;
