const oracledb = require('oracledb');
const database = require('../services/database');
const errorHandler = require('../utils/errorHandler');
const crypto = require('../utils/crypto');

module.exports.getList = async function (req, res) {
  const sql = 'docs_utils.get_owners';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pUser: req.params['user'],
  };

  try {
    const result = await database.procedureExecute(sql, bind);

    res.status(200).json(result);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.setOwner = async function (req, res) {
  const codePass = crypto.encrypt(req.body.pass);

  try {
    await database.setOwner(req.body.owner, req.body.connstr, codePass);

    res.status(200).json({ message: 'OK' });
  } catch (e) {
    console.log('owner error:', e);
    errorHandler(res, e);
  }
};

module.exports.getOwner = async function (req, res) {
  const owner = req.params['owner'];
  const sql = 'docs_utils.get_owner_user';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwner: owner,
  };

  try {
    const result = await database.procedureExecute(sql, bind);

    if (result.length > 0) {
      const connstr = result[0].connstr;
      const pass = result[0].pass;
      const encode = crypto.decrypt(result[0].pass);

      res.status(200).json({ connstr, pass, encode });
      return;
    }

    res.status(200).json(result);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getUserObj = async (user) => {
  const sql = 'docs_utils.get_owner_user';
  const bind = {
    pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    pOwner: user,
  };

  try {
    const result = await database.procedureExecute(sql, bind);

    if (result.length > 0) {
      const connStr = result[0].connstr;
      const pass = crypto.decrypt(result[0].pass);

      return {
        status: 'success',
        user,
        connStr,
        pass,
      };
    } else {
      return {
        status: 'no-user',
      };
    }
  } catch (e) {
    return {
      status: 'error',
      message: e.message,
    };
  }
};
