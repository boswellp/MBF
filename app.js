'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());

console.log("..........................in app.js");

app.get('/', function(req, res) {
    res.render('index', {
        //appToken: process.env.SMOOCH_APP_TOKEN
        appToken: process.env.MicrosoftAppId,
        //appPassword: process.env.MicrosoftAppPassword
    });
});

module.exports = app;
