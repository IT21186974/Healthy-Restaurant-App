import React, { useState } from 'react';
import { 
    Card, CardContent, CardMedia, Typography, IconButton, CardActions, 
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe, onDelete }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // Ensure ingredients are in array format
    const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : recipe.ingredients.split(',');

    // Handle the deletion of a recipe
    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/recipes/${recipe._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            onDelete(recipe._id);
            setOpen(false);
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Card 
                sx={{ 
                    maxWidth: 400, 
                    margin: 2, 
                    backgroundColor: '#fff8e1',
                    boxShadow: 3 
                }}
            >
                <CardMedia
                    component="img"
                    height="240"
                    image={`http://localhost:5000/${recipe.image}`}
                    alt={recipe.title}
                />
                <CardContent>
                    <Typography variant="h5" component="div" sx={{ color: '#ff8f00' }}>
                        {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {recipe.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Ingredients:</strong> {ingredients.join(', ')}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Instructions:</strong> {recipe.instructions}
                    </Typography>
                    {recipe.cookingTime && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
                        </Typography>
                    )}
                    {recipe.category && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Category:</strong> {recipe.category}
                        </Typography>
                    )}
                    {recipe.dietaryPreference && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Dietary Preference:</strong> {recipe.dietaryPreference}
                        </Typography>
                    )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton 
                        onClick={() => navigate(`/edit-recipe/${recipe._id}`)} 
                        sx={{ color: '#ff8f00' }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton 
                        onClick={handleClickOpen} 
                        sx={{ color: '#d32f2f' }}
                    >
                        <Delete />
                    </IconButton>
                </CardActions>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this recipe? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RecipeCard;
