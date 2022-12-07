const database = require('../services/database');
const oracledb = require('oracledb');
const errorHandler = require('../utils/errorHandler');

// docs_utils.get_context(p_doc => :p_doc,
//   p_owner => :p_owner,
//   p_field => :p_field,
//   p_roles => :p_roles,
//   p_parent_id => :p_parent_id);

module.exports.get = async function (req, res) {
  const schema = req.params['schema'];
  const params = req.query;

  const sql = 'docs_utils.get_context';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: schema,
    pField: params.field,
    pRoles: params.roles || 'oper',
    pParentId: params.parent || 0,
  };

  try {
    const data = await database.procedureExecute(sql, bind);

    res.status(200).json({ data });
  } catch (e) {
    errorHandler(res, e);
  }
};
