const express = require('express');
const passport = require('passport');
const controller = require('../controllers/file-data');
const router = express.Router();

router.get(
  '/:schema/:table',
  passport.authenticate('jwt', { session: false }),
  controller.get
);

module.exports = router;
