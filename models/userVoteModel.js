const mongoose = require('mongoose');

const userVoteSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    recipeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    voteType: { 
        type: Number, 
        required: true 
    },
});

module.exports = mongoose.model('UserVote', userVoteSchema);