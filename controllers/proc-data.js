const oracledb = require('oracledb');
const serverConfig = require('../config/server');
const oraTypes = require('../common/ora-types');
const database = require('../services/database');
const errorHandler = require('../utils/errorHandler');

module.exports.get = async function (req, res) {
  const docName = req.params['name'];
  const schema = req.params['schema'];

  let connection = undefined;
  try {
    const docParams = JSON.parse(req.query.params);
    const uid = req.query.uid;
    const docId = req.query.docId;

    const query = prepareSql(docName, docParams);
    const stm = query.stm;
    const bind = query.bind;
    //todo сделать смену пула
    connection = await oracledb.getConnection(serverConfig.dbPool.poolAlias);
    oracledb.fetchAsString = [oracledb.CLOB];
    const result = await connection.execute(stm, bind, {
      extendedMetaData: true,
    });
    const outParams = docParams.filter((item) => item.inOut === 'OUT');
    const data = await outParams.reduce(async (acc, param) => {
      let collection = await acc;
      switch (param.type) {
        case 'REF_CURSOR':
          const data = await getCursorData(param, result);
          const fields = await getFields(schema, data.meta, docId);

          collection[param.name] = {
            fields,
            rows: data.rows,
            count: data.rows.length,
            type: 'cursor',
          };
          break;
        case 'VARCHAR2':
          const value = await result.outBinds[param.name];
          collection[param.name] = { data: value, type: 'string' };
          break;
        case 'CLOB':
          const text = await result.outBinds[param.name].getData();
          collection[param.name] = { data: text, type: 'text' };
          break;
      }
      return collection;
    }, Promise.resolve({}));

    res.status(200).json({
      uid,
      data,
    });
  } catch (e) {
    console.error(e);
    errorHandler(res, e);
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

function prepareSql(name, params) {
  params.sort((a, b) => a.position - b.position);

  const preStm = params.reduce((acc, curr) => acc + `:${curr.name}` + ',', '');

  const stm = `begin ${name}(${preStm.slice(0, -1)});end;`;

  const bind = params.reduce((acc, curr) => {
    const currType = curr.type.trim().replaceAll(' ', '_');
    acc[curr.name] = {
      type: oracledb[oraTypes.type[currType]],
      dir: oracledb[oraTypes.dir[curr.inOut]],
    };
    if (curr.value) {
      acc[curr.name].val = formatValue(curr.type, curr.value);
    }
    return acc;
  }, {});

  return {
    stm,
    bind,
  };
}

async function getCursorData(param, result) {
  const resultSet = result.outBinds[param.name];
  let row = null;
  let rowArray = [];

  const meta = resultSet.metaData;

  while ((row = await resultSet.getRow())) {
    const obj = {};
    meta.forEach((i, index) => {
      const key = toCamelCase(i.name);
      obj[key] = row[index];
    });

    rowArray.push(obj);
  }
  return { rows: rowArray, meta };
}

async function getFields(schema, meta, docId) {
  let fieldsStr = meta.reduce((acc, i) => {
    return acc + `'${i.name}',`;
  }, '');
  fieldsStr = fieldsStr.slice(0, -1);
  const proc = 'docs_utils.get_fields';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwn: schema.toUpperCase(),
    pFields: fieldsStr,
  };

  const fields = await database.procedureExecute(proc, bind);

  let fieldsResult = [];
  fields.forEach((item) => {
    const findIndex = fieldsResult.findIndex(
      (i) => i.fieldName === item.fieldName
    );
    if (item.docId === docId) {
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

  return fieldsResult.map((i) => {
    const order = meta.findIndex((field) => field.name === i.fieldName);
    return {
      ...i,
      order,
      fieldName: toCamelCase(i.fieldName),
      dbTypeName: meta[order].dbTypeName,
      meta: meta[order],
    };
  });
}

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

function formatValue(type, value) {
  switch (type) {
    case 'DATE':
      return new Date(value);
    case 'NUMBER':
      return Number(value).valueOf();
    default:
      return value;
  }
}
