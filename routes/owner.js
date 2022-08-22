const express = require('express');
const controller = require('../controllers/owner');
const router = express.Router();

router.get('/get-list/:owner', controller.getList);
router.post('/set-owner', controller.setOwner);
router.get('/get-owner/:owner', controller.getOwner);

module.exports = router;
