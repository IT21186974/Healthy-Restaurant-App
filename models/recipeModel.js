const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    ingredients: { 
        type: [String], 
        required: true 
    },
    instructions: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    cookingTime: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    dietaryPreference: {
        type: String,
        required: false
    },
    votes: { 
        type: Number, 
        default: 0 
    },
    voters: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ef: 'User' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
