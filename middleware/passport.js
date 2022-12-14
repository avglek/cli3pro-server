const JwtStratege = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');
const database = require('../services/database');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('jwt'),
};

module.exports = (passport) => {
  passport.use(
    new JwtStratege(options, async (payload, done) => {
      try {
        const result = await database.getUser(payload.user);
        if (result.length > 0) {
          return done(null, result[0]['userName']);
        } else {
          return done(null, false);
        }
      } catch (err) {
        //todo Доделать обработку ошибок
        console.log('error:', err);
        return done(err, false);
      }
    })
  );
};
