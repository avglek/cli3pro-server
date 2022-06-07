const express = require('express');
const passport = require('passport');
const controller = require('../controllers/proc-data');
const router = express.Router();

router.get(
  '/:name',
  passport.authenticate('jwt', { session: false }),
  controller.get
);

module.exports = router;
