const router = require('express').Router();
const {
    createReaction,
    deleteReaction,
} = require('../../controllers/reactionController');

// /api/reactions
router.route('/').post(createReaction);

// /api/reactions/:reactionId
router.route('/:reactionId').delete(deleteReaction);

module.exports = router;