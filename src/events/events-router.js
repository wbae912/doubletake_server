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
  city: xss(event.city),
  state: xss(event.state),
  country: xss(event.country),
  weather_summary: event.weather_summary,
  weather_icon: event.weather_icon,
  temperature: event.temperature,
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
    const { title, date_of_event, city, state, country, weather_summary, weather_icon, temperature } = req.body;
    const newEvent = { title, date_of_event };

    newEvent.user_id = req.user.id;

    for(let [key,value] of Object.entries(newEvent)) {
      if(!value) {
        return res.status(400).json({error: `Missing ${key} in request body`});
      }
    }

    // Adding properties after validation because these are not required fields...NOTE: that user_id is required, which is why the property is added before validation
    newEvent.city = city;
    newEvent.state = state;
    newEvent.country = country;
    newEvent.weather_summary = weather_summary;
    newEvent.weather_icon = weather_icon;
    newEvent.temperature = temperature;

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
  .route('/:id')
  .all(requireAuth)
  .all((req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const user_id = req.user.id;

    EventsService.getSpecificEventForUser(db,id,user_id)
      .then(event => {
        if(!event) {
          return res.status(404).json({error: 'Event does not exist'});
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
    const { title, date_of_event, city, state, country, weather_summary, weather_icon, temperature } = req.body;
    const editEvent = { title, date_of_event };

    const numberOfValues = Object.values(editEvent).filter(Boolean).length;
    if(numberOfValues === 0) {
      return res.status(400).json({error: 'Request body must contain either title or date_of_event'});
    }

    editEvent.city = city;
    editEvent.state = state;
    editEvent.country = country;
    editEvent.weather_summary = weather_summary;
    editEvent.weather_icon = weather_icon;
    editEvent.temperature = temperature;

    const db = req.app.get('db');
    const id = req.params.id;
    EventsService.editEvent(db,id,editEvent)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });


module.exports = eventRouter;