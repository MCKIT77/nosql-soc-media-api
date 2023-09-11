const router = require('express').Router();
const usersRoutes = require('./usersRoutes');
const thoughtsRoutes = require('./thoughtsRoutes');
const reactionsRoutes = require('./reactionsRoutes');

router.use('/users', usersRoutes);
router.use('/thoughts', thoughtsRoutes);
router.use('/reactions', reactionsRoutes);

module.exports = router;