const express = require('express');
const path = require('path');
const UserService = require('./user-service');

const userRouter = express.Router();
const jsonParser = express.json();

userRouter('/register', jsonParser, (req,res,next) => {
  const { password, username, email } = req.body;

  if(!password) {
    return res.status(400).json({error: 'Missing password in request body'});
  }
  if(!username) {
    return res.status(400).json({error: 'Missing username in request body'});
  }
  if(!email) {
    return res.status(400).json({error: 'Missing email in request body'});
  }

  const passwordError = UserService.validatePassword(password);

  if(passwordError) {
    return res.status(400).json({error: passwordError});
  }

  const db = req.app.get('db');
  UserService.hasUserWithUserName(db, username)
    .then(userExists => {
      if(userExists) {
        return res.status(400).json({error: 'Username already exists'});
      }
      return UserService.hashPassword(password)
        .then(hash => {
          const newUser = {
            username,
            password: hash,
            email
          };

          return UserService.insertUser(db, newUser)
            .then(user => {
              return res
                .status(201)
                .location(path.posix.join(req.originalUrl, `${user.id}`))
                .json(UserService.serializeUser(user));
            });
        });
    })
    .catch(next);
});

module.exports = userRouter;