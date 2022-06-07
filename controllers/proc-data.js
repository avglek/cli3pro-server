const oracledb = require('oracledb');
const oraTypes = require('../common/ora-types');

module.exports.get = async function (req, res) {
  const docName = req.params['name'];
  let connection = undefined;
  try {
    const docParams = JSON.parse(req.query.params);

    const query = prepareSql(docName, docParams);
    const stm = query.stm;

    const bind = query.bind;

    connection = await oracledb.getConnection();
    oracledb.fetchAsString = [oracledb.CLOB];
    const result = await connection.execute(stm, bind);
    const outParams = docParams.filter((item) => item.inOut === 'OUT');
    const allData = await outParams.reduce(async (acc, param) => {
      //console.log(param.type, param.name);
      let collection = await acc;
      switch (param.type) {
        case 'REF_CURSOR':
          const data = await getCursorData(param.name, result);
          collection[param.name] = { data: data[0], count: data.length };
          break;
        case 'VARCHAR2':
          const value = await result.outBinds[param.name];
          collection[param.name] = { data: value };
          break;
        case 'CLOB':
          const text = await result.outBinds[param.name].getData();
          collection[param.name] = { data: text };
          break;
      }
      return collection;
    }, Promise.resolve({}));

    //const data = await getCursorData('P_DOC', result);
    //console.log('get rows:', data?.length);

    res.status(200).json({
      name: docName,
      query: docParams,
      stm: query.stm,
      bind: query.bind,
      //data: data[0],
      dataAll: allData,
    });
  } catch (e) {
    console.error(e);
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
      acc[curr.name].val = curr.value;
    }
    return acc;
  }, {});

  return {
    stm,
    bind,
  };
}

async function getCursorData(paramName, result) {
  const resultSet = result.outBinds[paramName];
  let row = null;
  let rowArray = [];

  const meta = resultSet.metaData;

  while ((row = await resultSet.getRow())) {
    const obj = {};
    meta.forEach((i, index) => {
      const str = i.name;
      const inx = str.indexOf('_');
      let key;
      if (inx > 0) {
        key =
          str.slice(0, inx).toLowerCase() +
          str.slice(inx + 1, inx + 2) +
          str.slice(inx + 2).toLowerCase();
      } else {
        key = str.toLowerCase();
      }

      // console.log(key, str.indexOf('_'));
      obj[key] = row[index];
    });
    rowArray.push(obj);
  }
  //await resultSet.close();
  return rowArray;
}
