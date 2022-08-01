const express = require('express');
const controller = require('../controllers/owners');
const router = express.Router();

router.get('/get-list/:user', controller.getList);

module.exports = router;
