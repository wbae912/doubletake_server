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
  .all(requireAuth)
  .all((req,res,next) => {
    const db = req.app.get('id');
    const id = req.params.id;
    const user_id = req.user.id;

    EventsService.getSpecificEventForUser(db,id,user_id)
      .then(event => {
        if(!event) {
          return res.status(400).json({error: 'Event does not exist'});
        }
        res.event = event;
        next();
      })
      .catch(next);
  })
  .get((req,res,next) => {
    return res.status(200).json(serializeEvent(res.event));
  })
  .delete((req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;

    EventsService.deleteEvent(db,id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req,res,next) => {
    const { title, date_of_event, items } = req.body;
    const editEvent = { title, date_of_event, items };

    const numberOfValues = Object.values(editEvent).filter(Boolean).length;
    if(numberOfValues === 0) {
      return res.status(400).json({error: 'Request body must contain either title, date_of_event, or items'});
    }

    const db = req.app.get('db');
    const id = req.params.id;
    EventsService.editEvent(db,id,editEvent)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });


module.exports = eventRouter;