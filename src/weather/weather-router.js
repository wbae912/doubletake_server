const express = require('express');
const xss = require('xss');
const fetch = require('node-fetch');
const { requireAuth } = require('../middleware/jwt-auth');
const { MAPQUEST_API_KEY, WEATHERMAP_API_KEY } = require('../config');

const weatherRouter = express.Router();

const serializeLocation = location => ({
  city: xss(location.city),
  state: xss(location.state),
  country: xss(location.country)
});

weatherRouter
  .route('/')
  .get(requireAuth, async (req,res,next) => {
    const { city, state, country } = req.query;
    const locationObject = { city, state, country };
    serializeLocation(locationObject);

    // Tested in POSTMAN to see if string still works if one of the fields are empty. It works!
    let location = `${locationObject.city},${locationObject.state},${locationObject.country}`;

    // Added maxResults parameter of "5" to limit too large of data retrieved
    const mapquest_api_url = `http://www.mapquestapi.com/geocoding/v1/address?key=${MAPQUEST_API_KEY}&location=${location}&maxResults=5`;
    let map_response = await fetch(mapquest_api_url);
    let map_data = await map_response.json();

    if(map_data.info.statuscode === 400) {
      return res.status(400).json({error: 'Illegal argument from request'});
    }

    let latitude = map_data.results[0].locations[0].latLng.lat;
    let longitude = map_data.results[0].locations[0].latLng.lng;

    const weather_api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHERMAP_API_KEY}&units=imperial`;
    const weather_response = await fetch(weather_api_url);
    const weather_data = await weather_response.json();

    return res.status(200).json(weather_data);
  });

module.exports = weatherRouter;