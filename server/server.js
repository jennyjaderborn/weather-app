const express = require('express'); 
const app = express()
const port = 3000
const request = require('request');
const router = express.Router();
const path = require('path');


app.use(express.static( '../public/'));


//tells express which template we are going to use: pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));





app.get('/',(req, res) => {
    let url = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&units=metric&APPID=52bca177990ef3a0fafe3e3dbef8fbbc';


    /*request(url, function (err, response, body) {
        if(err){
          res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
          let weather = JSON.parse(body)
          if(weather.main == undefined){
            res.render('index', {weather: null, error: 'Error, please try again'});
          } else {
            let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
            res.render('index', {weather: weatherText, error: null});
          }
        }
      });*/
    request(url, (err, response, body) => {
        if(err){
            res.render('index', {weather: null, error: 'Error, please try again'})
        } else {
        let weather = JSON.parse(body);
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        console.log(weatherText)

        res.render('index', {weather: weatherText}); 
        }

    })
    }); 






app.listen(port, () => console.log(`App listening on port ${port}!`))
