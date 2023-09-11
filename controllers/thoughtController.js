const { Thought, User } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .populate('reactions')
                .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        const { thoughtText, username, userId } = req.body;

        try {
            const thought = await Thought.create({ thoughtText, username });
            await User.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } });
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            await User.updateMany({}, { $pull: { thoughts: thought._id } });
            await thought.remove();

            res.json({ message: 'Thought deleted' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

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