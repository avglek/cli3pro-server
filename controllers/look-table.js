const database = require('../services/database');
const oracledb = require('oracledb');
const errorHandler = require('../utils/errorHandler');

module.exports.get = async function (req, res) {
  const table = req.params['table'];
  const schema = req.params['schema'];
  const params = req.query;

  const sql = 'docs_utils.get_look_table';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: schema,
    pTable: table,
    pOrder: params.order,
    pStartRows: params.start || 0,
    pCountRows: params.count || 0,
    pSort: params.sort || 'asc',
    pSearchField: params.searchField,
    pSearchValue: params.searchValue,
  };

  try {
    const data = await database.procedureExecute(sql, bind);
    const count = await database.getTableRowCount(table);

    res.status(200).json({ data, count });
  } catch (e) {
    errorHandler(res, e);
  }
};
