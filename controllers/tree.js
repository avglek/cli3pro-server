const database = require('../services/database');
const oracledb = require('oracledb');
const errorHandler = require('../utils/errorHandler');

module.exports.get = async function (req, res) {
  const schema = req.params['schema'];
  const sql = 'docs_utils.get_left_tree';
  const bind = {
    pTree: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: schema,
  };

  try {
    const result = await database.procedureExecute(sql, bind);

    const tree = [];

    result.forEach((item) => {
      if (item.parentId === 0) {
        tree.push(item);
      } else {
        const parent = result.find((i) => i.docId === item.parentId);
        if (parent) {
          if (parent.children) {
            parent.children.push(item);
          } else {
            parent.children = [item];
          }
        }
      }
    });

    res.status(200).json(tree);
  } catch (e) {
    errorHandler(res, `Схема "${schema}" сейчас недоступна`);

    //errorHandler(res, e);
  }
};
