var http = require('http');
var express = require('express');
var path = require('path');
var app = express();
require('./routes')(app);
  app.use(express.static(path.join(__dirname, 'public')));
var server = http.createServer(app);
module.exports = server;
