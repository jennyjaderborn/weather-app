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
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric${apiKey}`;
    console.log(req.body.city);

    request(url, (err, response, body) => {
        if(err){
            res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
        let weather = JSON.parse(body);
        //console.log(weather.weather[0].description);
        if(weather.main == undefined || weather == undefined){
            res.render('index', {weather: null, error: 'your search was not found, please try again'});
          } else {

        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name} and ${weather.weather[0].description}!`;

        let iconId = weather.weather[0].icon;
         icon = `http://openweathermap.org/img/w/${iconId}.png`;

        let country = weather.sys.country;
        let countryFlag = `https://www.countryflags.io/${country}/shiny/48.png`;
        console.log(weatherText)
        console.log(weather);

        res.render('index', {weather: weatherText, city: weather.name, flag: countryFlag, error: null, icon}); 

          }
        }

    })
    }); 


app.listen(port, () => console.log(`App listening on port ${port}!`))
