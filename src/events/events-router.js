const express = require('express');
const EventsService = require('./events-service');
const xss = require('xss');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');

const eventRouter = express.Router();
const jsonParser = express.json();

const serializeEvent = event => ({
  id: event.id,
  title: xss(event.title),
  date_of_event: event.date_of_event,
  items: xss(event.items),
  user_id: event.user_id
});

eventRouter
  .route('/')
  .get(requireAuth, (req,res,next) => {
    const db = req.app.get('db');
    const user_id = req.user.id;
    EventsService.getAllEvents(db,user_id)
      .then(events => {
        return res.status(200).json(events.map(serializeEvent));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req,res,next) => {
    const { title, date_of_event, items } = req.body;
    const newEvent = { title, date_of_event, items };

    newEvent.user_id = req.user.id;

    for(let [key,value] of Object.entries(newEvent)) {
      if(!value) {
        return res.status(400).json({error: `Missing ${key} in request body`});
      }
    }

    const db = req.app.get('db');
    EventsService.postEvent(db,newEvent)
      .then(event => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${event.id}`))
          .json(serializeEvent(event));
      })
      .catch(next);
  });

eventRouter
  .route(':/id')
  .get(requireAuth, (req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const user_id = req.user.id;

    EventsService.getSpecificEventForUser(db,id,user_id)
  })

module.exports = eventRouter;