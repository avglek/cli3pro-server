const oracledb = require('oracledb');
const database = require('../services/database');
const errorHandler = require('../utils/errorHandler');

module.exports.getList = async function (req, res) {
  const sql = 'docs_utils.get_owners';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pUser: req.params['user'],
  };

  try {
    const result = await database.procedureExecute(sql, bind);

    res.status(200).json(result);
  } catch (e) {
    errorHandler(res, e);
  }
};
