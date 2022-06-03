const express = require('express');
const passport = require('passport');
const controller = require('../controllers/description');
const router = express.Router();

router.get(
  '/:schema/:id',
  passport.authenticate('jwt', { session: false }),
  controller.get
);

module.exports = router;
