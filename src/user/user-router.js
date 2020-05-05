const express = require('express');
const path = require('path');
const UserService = require('./user-service');

const userRouter = express.Router();
const jsonParser = express.json();

userRouter
  .post('/register', jsonParser, (req,res,next) => {
    const { password, username, email } = req.body;

    if(!password) {
      return res.status(400).json({error: 'Missing password'});
    }
    if(!username) {
      return res.status(400).json({error: 'Missing username'});
    }
    if(!email) {
      return res.status(400).json({error: 'Missing email'});
    }

    const passwordError = UserService.validatePassword(password);

    if(passwordError) {
      return res.status(400).json({error: passwordError});
    }

    const db = req.app.get('db');
    UserService.hasUserWithUserName(db, username, email)
      .then(userInfo => {
        if(userInfo && userInfo.email === email) {
          return res.status(400).json({error: 'Email is taken'});
        }
        if(userInfo && userInfo.username === username) {
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