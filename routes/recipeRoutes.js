const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const recipeController = require('../controllers/recipeController');

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Add a new recipe
router.post('/', authMiddleware, upload.single('image'), recipeController.createRecipe);

// Get all recipes (sorted by votes)
router.get('/all', recipeController.getAllRecipes);

// Fetch recipes for the logged-in user
router.get('/', authMiddleware, recipeController.getUserRecipes);

// Get a specific recipe by ID
router.get('/:id', recipeController.getRecipeById);

// Update a recipe
router.put('/:id', authMiddleware, recipeController.updateRecipe);

// Delete a recipe
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

// Upvote a recipe
router.post('/votes/upvote/:id', authMiddleware, recipeController.upvoteRecipe);

// Downvote a recipe
router.post('/votes/downvote/:id', authMiddleware, recipeController.downvoteRecipe);


module.exports = router;
