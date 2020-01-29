const express = require('express');
const EventsService = require('./events-service');
const xss = require('xss');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');

const eventRouter = express.Router();
const jsonParser = express.json();

module.exports = eventRouter;