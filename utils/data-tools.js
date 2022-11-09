const oracledb = require('oracledb');
const database = require('../services/database');

module.exports.getFields = async function getFields(schema, fieldsStr, docId) {
  const proc = 'docs_utils.get_fields';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: schema.toUpperCase(),
    pFields: fieldsStr,
  };

  const fields = await database.procedureExecute(proc, bind);

  let fieldsResult = [];
  console.log('fields:', fields);
  fields.forEach((item) => {
    const findIndex = fieldsResult.findIndex(
      (i) => i.fieldName === item.fieldName
    );

    if (item.docId == docId) {
      if (findIndex >= 0) {
        fieldsResult[findIndex] = { ...item };
      } else {
        fieldsResult.push(item);
      }
    } else if (item.docId === 0) {
      if (findIndex < 0) {
        fieldsResult.push(item);
      }
    }
  });

  console.log('result:', fieldsResult);

  return fieldsResult;
};

module.exports.toCamelCase = function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};
