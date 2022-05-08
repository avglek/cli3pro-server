const database = require('../services/database');
const oracledb = require('oracledb');
const errorHandler = require('../utils/errorHandler');

module.exports.get = async function (req, res) {
  const sql = 'get_tree_doc';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: req.param('shema'),
  };

  try {
    const result = await database.procExecute(sql, bind);

    res.status(200).json(result);
  } catch (e) {
    errorHandler(res, e);
  }
};
