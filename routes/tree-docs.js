const express = require('express');
const passport = require('passport');
const controller = require('../controllers/tree-docs');
const router = express.Router();

router.get(
  '/:schema/:parent',
  passport.authenticate('jwt', { session: false }),
  controller.get
);

module.exports = router;
