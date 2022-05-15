const database = require('../services/database');
const oracledb = require('oracledb');
const errorHandler = require('../utils/errorHandler');

module.exports.get = async function (req, res) {
  const sql = 'get_left_tree';
  const bind = {
    pTree: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: req.params['shema'],
  };

  try {
    const result = await database.procedureExecute(sql, bind);

    res.status(200).json(result);
  } catch (e) {
    errorHandler(res, e);
  }
};
