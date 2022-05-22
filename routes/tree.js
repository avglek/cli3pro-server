const express = require('express');
const passport = require('passport');
const controller = require('../controllers/tree');
const router = express.Router();

router.get(
  '/:schema',
  passport.authenticate('jwt', { session: false }),
  controller.get
);

module.exports = router;
