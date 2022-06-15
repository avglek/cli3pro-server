const express = require('express');
const passport = require('passport');
const controller = require('../controllers/proc-data');
const router = express.Router();

router.use('/:schema/:name', require('../middleware/filter'));
router.use('/:schema/:name', require('../middleware/cache'));

router.get(
  '/:schema/:name',
  passport.authenticate('jwt', { session: false }),
  controller.get
);

module.exports = router;
