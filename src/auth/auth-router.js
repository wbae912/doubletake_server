const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonParser = express.json();

authRouter
  .post('/login', jsonParser, (req,res,next) => {
    const { username, password } = req.body;
    const loginUser = { username, password };

    if(!username) {
      return res.status(400).json({error: 'Missing username in request body'});
    }
    if(!password) {
      return res.status(400).json({error: 'Missing password in request body'});
    }

    const db = req.app.get('db');
    const userName = loginUser.username;

    AuthService.getUserWithUserName(db, userName)
      .then(user => {
        if(!user) {
          return res.status(400).json({error: 'Incorrect username or password'});
        }
        return AuthService.comparePasswords(loginUser.password, user.password)
          .then(passwordsMatch => {
            if(!passwordsMatch) {
              return res.status(400).json({error: 'Incorrect username or password'});
            }
            const subject = user.username;
            const payload = { user_id: user.id };
            res.send({
              authToken: AuthService.createJwt(subject,payload)
            });
          });
      })
      .catch(next);
  });

module.exports = authRouter;