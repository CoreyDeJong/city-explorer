'use strict';

// {
//   "time": 1567792089082,
//   "summary": "Foggy in the morning."
// },
const weatherStuff = [];

function Weather(obj) {
  this.time = new Date(obj.time);
  this.forecast = obj.summary;

  weatherStuff.push(this);
}

Weather.prototype.render = function () {
  let source = $('#weather-results-template').html();
  let template = Handlebars.compile(source);
  return template(this);
};

const ajaxSettings = {
  method: 'get',
  dataType: 'json'
};

$.ajax('city-weather-data.json', ajaxSettings)
  .then(weather => {
    weather.data.forEach(day => {
      $('#weather-container').append(new Weather(day).render());
    });
  });



// render using handlebars
// append to the page

