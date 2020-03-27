require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const userRouter = require('../src/user/user-router');
const authRouter = require('../src/auth/auth-router');
const generalRouter = require('../src/general/general-router');
const eventRouter = require('../src/events/events-router');
const generalItemsRouter = require('../src/generalItems/generalItems-router');
const eventItemsRouter = require('../src/eventItems/eventItems-router');
const weatherRouter = require('../src/weather/weather-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/general', generalRouter);
app.use('/api/event', eventRouter);
app.use('/api/generalItems', generalItemsRouter);
app.use('/api/eventItems', eventItemsRouter);
app.use('/api/weather', weatherRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;