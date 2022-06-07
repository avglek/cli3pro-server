const database = require('../services/database');
const oracledb = require('oracledb');
const errorHandler = require('../utils/errorHandler');

module.exports.get = async function (req, res) {
  const docId = Number.parseInt(req.params['id']);
  const schema = req.params['schema'];

  const paramsSql = 'docs_utils.get_desc';
  const descSql = 'docs_utils.get_proc_doc';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: schema.toUpperCase(),
    pDocId: docId,
  };

  try {
    const paramsResult = await database.procedureExecute(paramsSql, bind);
    const descResult = await database.procedureExecute(descSql, bind);

    const doc = {};
    doc.id = docId;

    if (descResult.length > 0) {
      doc.description = descResult[0];
    }

    if (paramsResult.length > 0) {
      doc.procName = paramsResult[0].objectName;

      const inParams = paramsResult.filter((i) => i.inOut === 'IN');

      const params = [];

      inParams.forEach((item) => {
        const searchIndex = params.findIndex(
          (i) => i['argumentName'] === item['argumentName']
        );
        if (searchIndex < 0) {
          params.push(item);
        } else {
          if (item.docId === docId) {
            params.splice(searchIndex, 1, item);
          }
        }
      });

      if (params.length > 0) {
        doc.form = 'Y';
      } else {
        doc.form = 'N';
      }

      const outParams = paramsResult.filter((i) => i.inOut === 'OUT');

      doc.params = [...params, ...outParams];
    }
    //console.log(result);

    res.status(200).json(doc);
  } catch (e) {
    errorHandler(res, e);
  }
};
