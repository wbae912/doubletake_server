const bcrypt = require('bcryptjs');
const xss = require('xss');

// Lowercase, uppercase, number
const REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;

const UserService = {
  hasUserWithUserName(db, username) {
    return db
      .from('users')
      .where({username})
      .first()
      .then(user => {
        console.log(user);
        !!user;
      });
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => rows[0]);
  },

  validatePassword(password) {
    if(password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if(password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    if(password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if(!REGEX.test(password)) {
      return 'Password must contain at least one uppercase, lowercase, and numerical character';
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      password: xss(user.password),
      email: xss(user.email)
    };
  }
};

module.exports = UserService;