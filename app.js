// var express = require('express');
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
// var path = require('path');

// var app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hjs');
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function (req, res) {
//   res.render('index', { title: 'Express' });
// });

// // io.on('connection', function (socket) {
// //   socket.emit('news', { hello: 'world' });
// //   socket.on('my other event', function (data) {
// //     console.log(data);
// //   });
// // });

// //server.listen(3000);
// module.exports = app;
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var routes = require('./routes')
var realtime = require('./realtime')

app.locals.delimiters = '<% %>';
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


server.listen(5000);

realtime.setup(io)

// Statics
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', routes.index);
