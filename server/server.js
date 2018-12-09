const express = require('express'); 
const app = express()
const port = process.env.PORT || 3000;
const request = require('request');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

let apiKey = process.env.MY_KEY;

app.use(bodyParser.urlencoded({extended: false}))


//use timestamp converter for sunrise and sunset 


//app.use(express.static( '../public/'));
app.use(express.static(path.join(__dirname, '../public')));


//tells express which template we are going to use: pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));


app.get('/', (req, res) => {
    res.render('index', {weather: 'Select a city first..', error: null});
  })


app.post('/',(req, res) => {
    let city = req.body.city;
    let format = req.body.format;

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metri${format}${apiKey}`;

    request(url, (err, response, body) => {
        if(err){
            res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
        let weather = JSON.parse(body);
        if(weather.main == undefined || weather == undefined){
            res.render('index', {weather: null, error: 'your search was not found, please try again'});
          } else {

        format = format.toUpperCase();
        let weatherText = `It's ${weather.main.temp}  ${format} º  degrees in ${weather.name} and ${weather.weather[0].description}!`;

        let iconId = weather.weather[0].icon;
         icon = `http://openweathermap.org/img/w/${iconId}.png`;

        let country = weather.sys.country;
        let countryFlag = `https://www.countryflags.io/${country}/shiny/48.png`;
        console.log(weatherText)
        console.log(weather);

      myTimeConverter = (time) => {
        let date = new Date(time*1000);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        return `${hours}:${minutes.substr(-2)}`
      }
      let sunrise = myTimeConverter(weather.sys.sunrise)
      let sunset = myTimeConverter(weather.sys.sunset);
    

      console.log('SUUUN', sunset, sunrise); 

        res.render('index', {weather: weatherText, city: weather.name, flag: countryFlag, error: null, icon, sunset, sunrise}); 

          }
        }

    })
    }); 


    app.use((req, res, next) => {
        const error = new Error("Not found");
        error.status = 404;
        next(error); //next calls the next errorfunction, ??passes error to express
      });
      
      app.use((error, req, res, next) => {
        res.status(error.status);
        res.render('error', { error });
      });
    

app.listen(port, () => console.log(`App listening on port ${port}!`))

