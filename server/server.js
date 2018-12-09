const express = require('express'); 
const app = express()
const port = process.env.PORT || 3000;
const request = require('request');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

//get apikey from .env
let apiKey = process.env.MY_KEY;

app.use(bodyParser.urlencoded({extended: false}))

//serving static files: js, css images
app.use(express.static(path.join(__dirname, '../public')));


//tells express which template we are going to use: pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

//home route
app.get('/', (req, res) => {
    res.render('index', {weather: 'Select a city first..', error: null});
  })


app.post('/',(req, res) => {
    //get city from input
    let city = req.body.city;
    //get celsius/fahrenheit
    let format = req.body.format;

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metri${format}${apiKey}`;

    // getting data using request
    request(url, (err, response, body) => {

        if(err){
            res.render('index', {weather: null, error: 'Error, please try again'});
        } 
        else {
        let weather = JSON.parse(body);

        if(weather.main == undefined){
            res.render('index', {weather: null, error: 'your search was not found, please try again'});
          } else {

        let weatherText = `It's ${weather.main.temp}  ${format.toUpperCase()} º  degrees in ${weather.name} and ${weather.weather[0].description}!`;
        
        //weather icon
        let iconId = weather.weather[0].icon;
         icon = `http://openweathermap.org/img/w/${iconId}.png`;
        
        //country flag
        let country = weather.sys.country;
        let countryFlag = `https://www.countryflags.io/${country}/shiny/48.png`;
          
      //timeconverter to convert timestamp for sunset and sunrise
      myTimeConverter = (time) => {
        let date = new Date(time*1000);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        return `${hours}:${minutes.substr(-2)}`
      }
      let sunrise = myTimeConverter(weather.sys.sunrise)
      let sunset = myTimeConverter(weather.sys.sunset);
    

        res.render('index', {weather: weatherText, city: weather.name, flag: countryFlag, error: null, icon, sunset, sunrise}); 

          }
        }

    })
    }); 


    app.use((req, res, next) => {
        const error = new Error("Not found");
        error.status = 404;
        next(error); //next passes error to express, calls the next errorfunction
      });
      
      app.use((error, req, res, next) => {
        res.status(error.status);
        res.render('error', { error });
      });
    

app.listen(port, () => console.log(`App listening on port ${port}!`))

