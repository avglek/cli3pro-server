const oracledb = require('oracledb');
const serverConfig = require('../config/server');

async function initialize() {
  const pull = await oracledb.createPool(serverConfig.dbPool);
}

module.exports.initialize = initialize;

async function close() {
  await oracledb.getPool().close();
}

module.exports.close = close;

async function procedureExecute(proc, binds = [], opts = {}) {
  let conn;
  let resultSet;

  const params = Object.keys(binds);
  const paramString = params.reduce((acc, param) => {
    return acc + `:${param},`;
  }, '');

  const sql = `begin ${proc}(${paramString.slice(0, -1)});end;`;

  const arr = [];
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(sql, binds, opts);

    resultSet = result.outBinds[params[0]];
    const meta = resultSet.metaData;

    let row;
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
      arr.push(obj);
    }
  } catch (err) {
    console.error('error:', err);
    throw new Error(err.message);
  } finally {
    if (resultSet) {
      try {
        await resultSet.close();
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    }
    if (conn) {
      // conn assignment worked, need to close
      try {
        await conn.close();
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    }
  }
  return arr;
}

module.exports.procedureExecute = procedureExecute;

function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    try {
      conn = await oracledb.getConnection();

      const result = await conn.execute(statement, binds, opts);

      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
          throw new Error(err.message);
        }
      }
    }
  });
}

module.exports.simpleExecute = simpleExecute;

async function getUser(user) {
  const sql = 'get_user';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pUser: user,
  };

  const result = await procedureExecute(sql, bind);
  return result;
}

module.exports.getUser = getUser;
