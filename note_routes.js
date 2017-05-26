const YQL = require('yql');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8080;
const DEFAULT_CITY = 'tel aviv';

function fetchWeatherForCity(city, cb) {
    const query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + city + '") and u=\'c\'');

    query.exec((err, data) => {
        console.log("Fetched result from Yahoo");

        if (err) return cb(err);
        if (!data.query.results) return cb(new Error("Empty results from Yahoo"));

        let location = data.query.results.channel.location;
        let condition = data.query.results.channel.item.condition;
        let forecast = data.query.results.channel.item.forecast[0];

        return cb(null, {
            location: location.city,
            temp: parseInt(condition.temp, 10),
            desc: condition.text,
            forecast: {
                high: parseInt(forecast.high, 10),
                low: parseInt(forecast.low, 10),
                desc: forecast.text
            }
        });
    });
}

let app = express();
app.use(bodyParser.json());

app.get('/weather', (req, res, next) => {
    console.log("Got GET request to /weather");

    fetchWeatherForCity(DEFAULT_CITY, (err, weather) => {
        if (err) return res.status(500).json({err: err.message});
        return res.json(weather);
    });
});

app.post('/weather', (req, res, next) => {
    console.dir(req.body);
    let city = req.body.city || DEFAULT_CITY;
    console.log("Got POST request to /weather, using city=" + city);

    fetchWeatherForCity(city, (err, weather) => {
        if (err) return res.status(500).json({err: err.message});
        return res.json(weather);
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});