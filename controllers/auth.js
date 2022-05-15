const database = require('../services/database');
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken');
const config = require('../config/server');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
  const candidate = req.body.user;
  try {
    const result = await database.getUser(candidate);

    if (result.length > 0) {
      const passwordResult = result[0]['PASSWORD'];
      const owner = result[0]['OWNER'];

      if (passwordResult === req.body.password) {
        const sql = 'get_roles';
        const bind = {
          pDoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
          pUser: candidate,
        };

        const roles = await database.procedureExecute(sql, bind);

        const token = jwt.sign(
          {
            user: candidate,
            roles: roles.map((i) => i['ROLE_NAME']),
            owner,
          },
          config.jwt,
          { expiresIn: 60 * 60 }
        );
        res.status(200).json({
          token: `Bearer ${token}`,
        });
      } else {
        res.status(401).json({
          message: 'Неправильный пароль.',
        });
      }
    } else {
      res.status(404).json({
        message: `Пользователь "${candidate}" не найден.`,
      });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
