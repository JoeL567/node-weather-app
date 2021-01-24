const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();

//configure path for views
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Set up templating engine and location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//configure static files routing
app.use(express.static(path.join(__dirname, '../public')));

//configure routing
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Joe Longman'
    });
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About',
        name: 'Joe Longman'
    });
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        message:'Here is a help message to display',
        name: 'Joe Longman'
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.location){
        return res.send({
            error:'No address was provided'
        })
    }

    //first get the geocode for the location string and pass result into forecast callback
    geocode(req.query.location, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({
                error
            })
        }
        forecast(latitude, longitude,(error, response) => {
            if(error){
                return res.send({
                    error
                })
            }
            else{
                res.send({
                    location,
                    forecast: response,
                });
            }
        });
    })
});

//api requests
app.get('/products',(req,res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term',
        })
    }
    console.log(req.query.search)
    res.send({
        products:[],
    })
})

//configure 404 pages
app.get('/help/*', (req, res) => {
    res.render('notfound', {
        title: '404',
        message: 'The help article could not be found',
        name: 'Joe Longman',
    });
});

app.get('*', (req, res) => {
    res.render('notfound', {
        title: '404',
        message: 'Page not found',
        name: 'Joe Longman',
    });
})

// configure ssl key for development
const options = {
    key: fs.readFileSync('src/key-decrypted.key'),
    cert: fs.readFileSync('src/cert.crt')
  };

// create the servers
http.createServer(app).listen(3001, () => {
    console.log('http server is running on port 3001');
});
https.createServer(options, app).listen(3000, () => {
    console.log('https server is running on port 3000');
});