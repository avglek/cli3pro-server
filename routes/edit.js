const express = require('express');
const passport = require('passport');
const controller = require('../controllers/edit');
const router = express.Router();

router.post(
  '/:schema/:table',
  passport.authenticate('jwt', { session: false }),
  controller.insert
);

module.exports = router;
