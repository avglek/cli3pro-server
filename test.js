const dbserver = require('./services/database');
const oracledb = require('oracledb');

async function startup() {
  try {
    await dbserver.initialize();
    console.log('db init');
    const stm = `begin test(:pDoc);end;`;
    const bind = {
      pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const data = await dbserver.simpleExecute(stm, bind);
    console.log('data:', data);
    //console.log('cursor:', data.outBinds.pDoc);

    const resultSet = data.outBinds.pDoc;
    let row;
    while ((row = await resultSet.getRow())) {
      console.log(row);
    }

    await resultSet.close();
    await dbserver.close();
  } catch (e) {
    console.log('error:', e);
  }
}

async function run() {
  try {
    connection = await oracledb.getConnection({
      user: 'cli3prof',
      password: 'twister',
      connectString: 'eva',
    });

    const stm = `begin test(:pDoc);end;`;
    const bind = {
      pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await connection.execute(stm, bind);

    const resultSet = result.outBinds.pDoc;
    let row;
    while ((row = await resultSet.getRow())) {
      console.log('row:', row);
    }
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

async function run2() {
  await dbserver.initialize();
  const stm = `begin test(:pDoc);end;`;
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
  };

  const result = await dbserver.procedureExecute(stm, bind);
  //const result = await dbserver.simpleExecute(stm, bind);
  const resultSet = result.outBinds.pDoc;
  let row;
  while ((row = await resultSet.getRow())) {
    console.log('row:', row);
  }
  await resultSet.close();
  // await dbserver.close();
}

console.log('start test');
run2();
console.log('end test');
