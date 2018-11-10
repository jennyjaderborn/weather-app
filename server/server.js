const express = require('express'); 
const app = express()
const port = 3000
const request = require('request');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: false}))

app.use(cookieParser());


//app.use(express.static( '../public/'));
app.use(express.static(path.join(__dirname, '../public')));


//tells express which template we are going to use: pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));


app.get('/', (req, res) => {
    res.render('index', {weather: null, error: null});
  })


app.post('/',(req, res) => {
    let url = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&units=metric&APPID=52bca177990ef3a0fafe3e3dbef8fbbc';

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

    /*app.get('/weather', (req, res) => {
        res.render('index');
    });*/

    /*app.post('/weather', (req, res) => {
        //res.cookie('city', req.body.city);
        console.log('click');
        console.log(req.body.city);
        res.cookie('city', req.body.city);
        res.redirect('/');
    });*/






app.listen(port, () => console.log(`App listening on port ${port}!`))
