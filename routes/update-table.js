const express = require('express');
const passport = require('passport');
const controller = require('../controllers/update-table');
const router = express.Router();

router.post(
  '/:schema/:table',
  passport.authenticate('jwt', { session: false }),
  controller.update
);

module.exports = router;
