const express = require('express');
const controller = require('../controllers/owner');
const passport = require('passport');
const router = express.Router();

router.get(
  '/get-list/:owner',
  passport.authenticate('jwt', { session: false }),
  controller.getList
);
router.post(
  '/set-owner',
  passport.authenticate('jwt', { session: false }),
  controller.setOwner
);
router.get(
  '/get-owner/:owner',
  passport.authenticate('jwt', { session: false }),
  controller.getOwner
);

module.exports = router;
