const oracledb = require('oracledb');
const oraTypes = require('./common/ora-types');

const proc = 'COMMON.HIPPO_2730';
const params = [
  {
    name: 'P_DOC',
    type: 'REF_CURSOR',
    position: 1,
    inOut: 'OUT',
    start: 0,
    end: 50,
    sort: { ksnv: 'desc' },
    filter: [{ field: 'msnv', value: 'Мга', rules: 'eq' }],
  },
];

function simpleExecute(conn, statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    try {
      const result = await conn.execute(statement, binds, opts);

      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

async function run() {
  try {
    connection = await oracledb.getConnection({
      user: 'cli3prof',
      password: 'twister',
      connectString: 'eva',
    });

    // const stm = `begin ${proc}(:P_DOC,:P_SUBGR);end;`;
    // const bind = {
    //   P_DOC: { type: oracledb['CURSOR'], dir: oracledb['BIND_OUT'] },
    //   P_SUBGR: {
    //     type: oracledb['VARCHAR'],
    //     dir: oracledb['BIND_IN'],
    //     val: 'КД',
    //   },
    // };

    const query = prepareSql(params);
    const stm = query.stm;
    const bind = query.bind;

    const result = await connection.execute(stm, bind);

    const resultSet = result.outBinds['P_DOC'];
    let row;
    const rowArray = [];
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
    console.log(rowArray[0], rowArray.length);
    console.log(new Date());
    await resultSet.close();
  } catch (err) {
    console.error(err.message);
  } finally {
    if (connection) {
      try {
        await connection.close(); // Always close connections
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

function prepareSql(inParams) {
  const localParams = inParams.sort((a, b) => a.position - b.position);

  const stm2 = localParams.reduce((acc, cur) => acc + `:${cur.name}` + ',', '');

  let stm = `begin ${proc}(${stm2.slice(0, -1)});end;`;

  let bind = {
    ora: oraTypes.type['VARCHAR2'],
    type: oracledb[oraTypes.type['REF_CURSOR']],
    dir: oracledb[oraTypes.dir['OUT']],
  };

  bind = localParams.reduce((acc, curr) => {
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

/**********
 *
 * „<” (знак меньше),  „>” (знак больше), „:” (двоеточие), „«” (двойные кавычки), „/” (слеш), „\” (обратный слеш), „|” (вертикальная черта), „?” (вопросительный знак), „*” (звездочка)
 * @param str
 * @returns {string}
 */

function checkFileName(str) {
  return str.replace(/['<','>',':','\"','\"','\/','\\','|','?','*']/g, '_');
}

const insertRow = {
  styleName: 'taxi_test',
  fontName: 'arial',
  color: '',
  bkColor: '255',
  displayLabel: 'test',
  options: '',
  width: '',
};

function prepareInsertSql() {
  const tableName = 'test_styles';
  const keys = Object.keys(insertRow);
  let params = keys.reduce((acc, i) => {
    acc = acc + `:${i}, `;
    return acc;
  }, '');
  return `insert into ${tableName} values  (${params.trim().slice(0, -1)})`;
}

async function testInsert() {
  let connection;

  const sql = prepareInsertSql();

  const binds = [insertRow];

  const options = {
    autoCommit: true,
  };

  try {
    connection = await oracledb.getConnection({
      user: 'common',
      password: 'pass4common',
      connectString: 'eva',
    });

    const result = await connection.executeMany(sql, binds, options);
    console.log('Result is:', result);
  } catch (err) {
    console.log('error:', err.message);
  } finally {
    if (connection) {
      try {
        await connection.close(); // Always close connections
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

async function executeProc() {
  let connection = null;
  try {
    connection = await oracledb.getConnection({
      user: 'client02',
      password: 'pass4client02',
      connectString: 'eva',
    });

    const stm = `begin test_01(:P_DOC);end;`;
    const bind = {
      P_DOC: { type: oracledb['CURSOR'], dir: oracledb['BIND_OUT'] },
    };

    const result = await connection.execute(stm, bind);
    const resultSet = result.outBinds['P_DOC'];

    let row;
    const rowArray = [];
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
    console.log(rowArray[0], rowArray.length);
  } catch (e) {
    console.log('error:', e);
  } finally {
    if (connection) {
      connection.close();
    }
  }
}

console.log('start test');

executeProc().then(() => console.log('end'));
