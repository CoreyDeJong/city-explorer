'use strict';


//express is a library that is our server
const express = require('express');

//creates a const called app that is equal to express that requires the express library to be used. All future use of "app" will trigger that to use express
const app = express();

//pg is the library that connects the server to the database
const pg = require('pg');

require('dotenv').config();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;

// server set-up
// database is a connection object to our postgress instance
const database = new pg.Client(process.env.DATABASE_URL);
database.on('error', err => console.error(err));
database.connect();

const superagent = require('superagent');

app.get('/location', (request, response) => {
  let city = request.query.city;
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`;

console.log(url);

  superagent.get(url)
    .then(superagentResults => {
      let location = new City(city, superagentResults.body[0])
      response.send(location);
    })
})

app.get('/weather', (request, response) => {
  let locationObject = request.query;
  console.log(locationObject)

  let url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${locationObject.latitude},${locationObject.longitude}`;

  console.log(url);
  superagent.get(url)
    .then(results => {
      let weatherArray = results.body.daily.data;

      let weatherMap = weatherArray.map(day => new Weather(day));

      response.status(200).send(weatherMap);
      // loop over the array
      // send in each object to the constructor
    })
})

app.get('/trails', (request, response) => {
  let { 
  latitude, 
  longitude, } = request.query;

  let url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${process.env.TRAILS_API}`;

  console.log(url);

  superagent.get(url)
    .then(results => {
      const dataObj = results.body.trails.map(trail => new Trail(trail));
      response.status(200).send(dataObj)
    })
})

function City(city, obj){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

function Weather(obj){
  this.time = new Date(obj.time*1000).toDateString();
  this.forecast = obj.summary;
}

function Trail(obj){
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionStatus;
  this.condition_date = obj.conditionDate.slice(0,10);
  this.condition_time = obj.conditionDate.slice(11,19);
}

//lab 8
app.get('/display', (request, response))


app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})