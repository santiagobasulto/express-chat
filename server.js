var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var routes = require('./routes')
var realtime = require('./realtime')
var logger = require('./logger')

// Changed hogan.js delimiters so it won't conflict with Angular
app.locals.delimiters = '<% %>';
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


server.listen(5000);

realtime.setup(io)

// Statics
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', routes.index);
