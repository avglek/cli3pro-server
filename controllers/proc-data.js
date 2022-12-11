const oracledb = require('oracledb');
const config = require('config');
const oraTypes = require('../common/ora-types');
const errorHandler = require('../utils/errorHandler');
const owner = require('./owner');
const tools = require('../utils/data-tools');

module.exports.get = async function (req, res) {
  const token = req.get('authorization').split(' ')[1];

  const docName = req.params['name'];
  const schema = req.params['schema'];

  let connection = undefined;
  let pool = undefined;

  try {
    const tokenObj = tools.parseJwt(token);

    const docParams = JSON.parse(req.query.params);
    const uid = req.query.uid;
    const docId = req.query.docId;

    const query = prepareSql(docName, docParams);
    const stm = query.stm;
    const bind = query.bind;

    const userObject = await owner.getUserObj(schema);

    if (userObject.status === 'success') {
      pool = await oracledb.getPool(config.get('dbUserPool.poolAlias'));
      connection = await pool.getConnection({
        user: userObject.user,
        password: userObject.pass,
      });
    } else {
      pool = await oracledb.getPool(config.get('dbRootPool.poolAlias'));
      connection = await pool.getConnection();
    }
    oracledb.fetchAsString = [oracledb.CLOB];
    let result;
    try {
      result = await connection.execute(stm, bind, {
        extendedMetaData: true,
      });
    } catch (e) {
      console.log('execute err:', e.message);
    }
    const outBindsKeys = Object.keys(result.outBinds);
    const outParams = docParams.filter((item) =>
      outBindsKeys.includes(item.name)
    );
    const data = await outParams.reduce(async (acc, param) => {
      let collection = await acc;
      switch (param.type) {
        case 'REF_CURSOR':
          let styles;
          const data = await getCursorData(param, result);

          if (data.styles) {
            styles = await tools.getStyles(data.styles, schema);
          }

          const fieldsArr = data.meta.map((i) => i.name);

          const fieldsResult = await tools.getFields(schema, fieldsArr, docId);

          const fields = data.meta.map((field, index) => {
            const order = fieldsResult.findIndex(
              (i) => field.name === i.fieldName
            );
            return {
              ...fieldsResult[order],
              order: index,
              fieldName: tools.toCamelCase(field.name),
              dbTypeName: field.dbTypeName,
              meta: field,
            };
          });

          const context = await tools.getContext(
            schema,
            fieldsArr,
            docId,
            tokenObj.roles
          );

          collection[param.name] = {
            fields,
            styles,
            context,
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
  try {
    const resultSet = result.outBinds[param.name];
    let row = null;
    let rowArray = [];
    const stylesArray = [];
    let meta = null;

    if (resultSet) {
      meta = resultSet.metaData;

      while ((row = await resultSet.getRow())) {
        const obj = {};
        meta.forEach((i, index) => {
          const key = tools.toCamelCase(i.name);
          obj[key] = row[index];
          if (key.includes('style')) {
            if (stylesArray.indexOf(obj[key]) < 0 && !!obj[key])
              stylesArray.push(obj[key]);
          }
        });

        rowArray.push(obj);
      }
    }
    return { rows: rowArray, meta, styles: stylesArray };
  } catch (e) {
    console.log('err:', e.message);
  }
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
