const oracledb = require('oracledb');
const database = require('../services/database');

module.exports.getFields = async function getFields(schema, fieldsArr, docId) {
  const proc = 'docs_utils.get_fields';

  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: schema.toUpperCase(),
    pFields: arrayToParamString(fieldsArr),
  };

  const fields = await database.procedureExecute(proc, bind);

  let fieldsResult = [];
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

  return fieldsResult;
};

module.exports.getStyles = async function getStyles(stylesArr, schema) {
  if (stylesArr.length === 0) {
    return [];
  }

  const proc = 'docs_utils.get_styles';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: schema.toUpperCase(),
    pStyles: arrayToParamString(stylesArr),
  };

  return await database.procedureExecute(proc, bind);
};

module.exports.getContext = async function (schema, fields, parent, roles) {
  if (fields.length === 0) {
    return [];
  }

  const proc = 'docs_utils.get_context';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwner: schema.toUpperCase(),
    pFields: arrayToParamString(fields, true),
    pRoles: arrayToParamString(roles),
    pParent: parent || 0,
  };

  return await database.procedureExecute(proc, bind);
};

module.exports.toCamelCase = function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

module.exports.parseJwt = function (token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function arrayToParamString(arr, upper = false) {
  if (upper) {
    return arr.map((i) => `'${i.toUpperCase()}'`).join(',');
  }
  return arr.map((i) => `'${i}'`).join(',');
}
