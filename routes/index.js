var express = require('express');
var app = express();

let login = require('./login');
let register = require('./register');
let accountDetails = require('./account');

app.use(login);
app.use(register);
app.use(accountDetails);

module.exports = app;