const oracledb = require('oracledb');

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

    const stm = `begin get_left_tree(:pDoc,:pOwn);end;`;
    const bind = {
      pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      pOwn: 'sevstal_ch',
    };

    const result = await connection.execute(stm, bind);

    const resultSet = result.outBinds.pDoc;
    let row;
    const rowArray = [];
    console.log(new Date());
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
    //console.log(new Date());
    // const rows = simpleExecute(connection, 'select * from v_test2');
    // console.log(rows[0], rows.length);
    //console.log(new Date());
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

console.log('start test');
run();
console.log('end test');
