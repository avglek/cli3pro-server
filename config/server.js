module.exports = {
  port: process.env.HTTP_PORT || 5000,
  dbPool: {
    user: 'cli3prof',
    password: 'twister',
    connectString: 'eva',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0,
    poolAlias: 'eva',
    poolPingInterval: 0,
  },
  jwt: 'dev-jwt',
};
