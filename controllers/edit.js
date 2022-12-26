const database = require('../services/database');
const owner = require('./owner');

module.exports.insert = async function (req, res) {
  try {
    const tableName = req.params.table;
    const schema = tableName.includes('COMMON') ? 'COMMON' : req.params.schema;

    const userObject = await owner.getUserObj(schema);

    console.log('owner:', userObject);

    const addRows = [];
    const deleteRows = [];
    const updateRows = [];

    req.body.forEach((item) => {
      if (item.add) addRows.push(item.add);
      if (item.delete) deleteRows.push(item.delete);
      if (item.update) updateRows.push(item.update);
    });

    if (deleteRows.length > 0) {
      const params = bindParams(deleteRows);
      await database.deleteRows(
        tableName,
        params.binds,
        params.bindDef,
        userObject
      );
    }
    if (addRows.length > 0) {
      const params = bindParams(addRows);
      await database.insertRows(
        tableName,
        params.binds,
        params.bindDef,
        userObject
      );
    }
    if (updateRows.length > 0) {
      const params = bindParams(updateRows);
      await database.updateRows(
        tableName,
        params.binds,
        params.bindDef,
        userObject
      );
    }

    res.status(200).json({ message: 'ok' });
  } catch (e) {
    res.status(500).json({ message: `error:${e.message}` });
  }
};

function bindParams(rows) {
  const binds = [];
  let bindDef;

  rows.forEach((row) => {
    const bind = row.reduce((acc, item) => {
      Object.assign(acc, { [item.name]: item.value });
      return acc;
    }, {});
    if (!bindDef) {
      bindDef = row.reduce((acc, item) => {
        Object.assign(acc, { [item.name]: { type: item.type } });
        return acc;
      }, {});
    }
    binds.push(bind);
  });

  return { binds, bindDef };
}
