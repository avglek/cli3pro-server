const database = require('../services/database');
const oracledb = require('oracledb');
const errorHandler = require('../utils/errorHandler');

module.exports.get = async function (req, res) {
  console.log('file-data:', req);
  res.status(200).json({ message: 'ok' });
};
