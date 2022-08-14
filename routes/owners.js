const express = require('express');
const controller = require('../controllers/owners');
const router = express.Router();

router.get('/get-list/:user', controller.getList);
router.post('/set-owner', controller.setOwner);
router.get('/get-owner/:owner', controller.getOwner);

module.exports = router;
