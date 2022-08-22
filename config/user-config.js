const owner = require('../controllers/owner');

module.exports.getUserPool = async function (user) {
  const userObj = await owner.getUserObj(user);

  if (userObj.status === 'success') {
    return {
      user: user,
      password: userObj.pass,
      connectString: 'eva',
      poolMin: 10,
      poolMax: 10,
      poolIncrement: 0,
      poolAlias: user,
      poolPingInterval: 0,
    };
  } else {
    return null;
  }
};
