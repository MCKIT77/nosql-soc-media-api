const { Thought } = require('../models');

module.exports = {
    async createReaction(req, res) {
        const { thoughtId } = req.params;
        const { reactionBody, username } = req.body;

        try {
            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                {
                    $push: {
                        reactions: { reactionBody, username },
                    },
                },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteReaction(req, res) {
        const { thoughtId, reactionId } = req.params;

        try {
            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                {
                    $pull: {
                        reactions: { _id: reactionId },
                    },
                },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};