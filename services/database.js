const oracledb = require('oracledb');
const config = require('config');

//let rootPool, userPool;
module.exports.version = function () {
  const version = config.get('version');
  const db = config.get('dbRootPool.connectString');
  return { version, db };
};

async function initialize() {
  const dbName = config.get('dbRootPool.connectString');
  console.log(`Connected to ${dbName} ...`);
  const rootPool = await oracledb.createPool(config.get('dbRootPool'));
  const userPool = await oracledb.createPool(config.get('dbUserPool'));
  console.log(
    `Connection pool ${rootPool.poolAlias} and ${userPool.poolAlias} is created`
  );
}

module.exports.initialize = initialize;

async function close() {
  await oracledb.getPool(config.get('dbRootPool.poolAlias')).close(10);
  await oracledb.getPool(config.get('dbUserPool.poolAlias')).close(10);
}

module.exports.close = close;

async function getTableRowCount(table) {
  const sql = `select count(*) from ${table}`;

  let connection;

  try {
    connection = await oracledb.getConnection(
      config.get('dbRootPool.poolAlias')
    );

    const result = await connection.execute(sql);

    return result.rows[0][0];
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports.getTableRowCount = getTableRowCount;

async function procedureExecute(proc, binds = [], opts = {}, owner = {}) {
  let conn;
  let resultSet;
  let pool;

  const params = Object.keys(binds);
  const paramString = params.reduce((acc, param) => {
    return acc + `:${param},`;
  }, '');

  const sql = `begin ${proc}(${paramString.slice(0, -1)});end;`;

  const arr = [];
  try {
    if (owner.user && owner.pass) {
      pool = oracledb.getPool(config.get('dbUserPool.poolAlias'));
      conn = await pool.getConnection(owner.user, owner.pass);
    } else {
      pool = oracledb.getPool(config.get('dbRootPool.poolAlias'));
      conn = await pool.getConnection();
    }

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
        console.log('conn close:', err);
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
      conn = await oracledb.getConnection(config.get('dbRootPool.poolAlias'));

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

  return await procedureExecute(sql, bind);
}

module.exports.getUser = getUser;

module.exports.setOwner = async function (owner, connstr, pass) {
  const sql = 'begin docs_utils.set_owner_user(:owner,:connstr,:pass);end;';
  const bind = { owner, connstr, pass };
  let conn;

  try {
    conn = await oracledb.getConnection(config.get('dbRootPool.poolAlias'));

    return await conn.execute(sql, bind);
  } catch (err) {
    console.error('own error:', err);
    throw new Error(err.message);
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      try {
        await conn.close();
        console.log('finally conn close');
      } catch (err) {
        console.log('own conn close:', err);
      }
    }
  }
};
