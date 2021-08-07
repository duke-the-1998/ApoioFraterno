const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const db = require('./database');

function initialize(passport) {
  const authenticateUser = async (nome, password, done) => {
    const user = await db.promise().query(`SELECT * FROM USERS WHERE NOME = '${nome}'`);
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

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.nome));
  passport.deserializeUser(async (nome, done) => {
    const user = await db.promise().query(`SELECT * FROM USERS WHERE NOME = '${nome}'`);
    return done(null, user[0][0]) ;
  });
}

module.exports = initialize;