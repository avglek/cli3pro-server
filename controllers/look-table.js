const database = require('../services/database');
const oracledb = require('oracledb');
const errorHandler = require('../utils/errorHandler');

/******************
 *   docs_utils.get_look_table(p_doc => :p_doc,
 *                             p_owner => :p_owner,
 *                             p_table => :p_table,
 *                             p_order => :p_order,
 *                             p_start_row => :p_start_row,
 *                             p_count_row => :p_count_row,
 *                             p_sort);
 *
 *                                    "order": "ms",
 *         "start": "4471",
 *         "count": "20",
 *         "sort": "desc"
 */

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
