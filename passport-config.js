const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const db = require('./database');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await db.promise().query(`SELECT * FROM USERS WHERE EMAIL = '${email}'`);
    if (user[0].length === 0) {
      return done(null, false, { message: 'No user with that username' });
    }

    try {
      if (await bcrypt.compare(password, user[0][0].password)) {
        return done(null, user[0][0]);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.email));
  passport.deserializeUser(async (email, done) => {
    const user = await db.promise().query(`SELECT * FROM USERS WHERE EMAIL = '${email}'`);
    return done(null, user[0][0]) ;
  });
}

module.exports = initialize;