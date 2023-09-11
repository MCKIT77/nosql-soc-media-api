const mongoose = require('mongoose');
const { Schema } = mongoose;

// Reactions are subdoc
const reactionSchema = new Schema({
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => new Date(timestamp).toLocaleString(),
    },
});

// Thought schema contains reaction schema as sub
const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema], // Array of Reaction subdocuments
});

// Virtual prop for reaction count
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;