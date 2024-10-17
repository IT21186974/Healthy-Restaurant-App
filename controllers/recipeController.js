const Recipe = require('../models/recipeModel');
const UserVote = require('../models/userVoteModel');

// Create a new recipe
exports.createRecipe = async (req, res) => {
    const { title, description, ingredients, instructions, cookingTime, category, dietaryPreference } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            instructions,
            cookingTime,
            category,
            dietaryPreference,
            image,
            userId: req.user.id,
            votes: 0,
        });

        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(400).json({ message: 'Failed to create recipe', error });
    }
};

// Get all recipes (sorted by votes)
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ votes: -1 });
        res.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Fetch recipes for the logged-in user
exports.getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ userId: req.user.id });
        res.json(recipes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Get a specific recipe by ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, cookingTime, category, dietaryPreference } = req.body;

        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        // Ensure the recipe belongs to the logged-in user
        if (recipe.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to update this recipe' });
        }

        // Update the recipe fields
        recipe.title = title || recipe.title;
        recipe.description = description || recipe.description;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        recipe.cookingTime = cookingTime || recipe.cookingTime;
        recipe.category = category || recipe.category;
        recipe.dietaryPreference = dietaryPreference || recipe.dietaryPreference;

        const updatedRecipe = await recipe.save();

        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(400).json({ msg: 'Failed to update recipe', error });
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        // Ensure the recipe belongs to the logged-in user
        if (recipe.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to delete this recipe' });
        }

        await recipe.deleteOne();
        res.status(200).json({ msg: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(400).json({ msg: 'Failed to delete recipe', error });
    }
};

// Upvote a recipe
exports.upvoteRecipe = async (req, res) => {
    const userId = req.user.id;

    try {
        const recipeId = req.params.id;
        const existingVote = await UserVote.findOne({ userId, recipeId });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted on this recipe' });
        } else {
            return res.status(201).json({ message: 'You have successfully Upvoted this recipe' });
        }

        // Create a new user vote
        const newVote = new UserVote({ userId, recipeId, voteType: 1 });
        await newVote.save(); // Save the user's vote

        // Increment the recipe's vote count
        const recipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { $inc: { votes: 1 } },
            { new: true, runValidators: false }
        );

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        console.error('Error upvoting recipe:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Downvote a recipe
exports.downvoteRecipe = async (req, res) => {
    const userId = req.user.id;

    try {
        const recipeId = req.params.id;
        const existingVote = await UserVote.findOne({ userId, recipeId });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted on this recipe' });
        } else {
            return res.status(201).json({ message: 'You have Down-Voted this recipe' });
        }

        // Create a new user vote
        const newVote = new UserVote({ userId, recipeId, voteType: -1 });
        await newVote.save(); // Save the user's vote

        // Decrement the recipe's vote count
        const recipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { $inc: { votes: -1 } },
            { new: true, runValidators: false }
        );

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        console.error('Error downvoting recipe:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
