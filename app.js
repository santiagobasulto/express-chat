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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000);

var ID = 1
var connectedClients = {}

var getClientId = function(){
    return ID++
}

var getRandomName = function(){
  return ("Oneryx Ocelot-" + (ID - 1))
}

var getClientById = function(id){
    var client = connectedClients[id];
    if(client){
        return client;
    }
    throw {message: "No client found with that ID"}
}

app.get('/', function (req, res) {
  res.render('index', {});
});

var sockets = [];

io.on('connection', function (socket) {
  console.log("Connection established");
  sockets.push(socket);

  var client = {
    id: getClientId(),
    name: getRandomName()
  };
  connectedClients[client.id] = client;

  socket.emit('setup', client);

  socket.on('chat message', function (data) {
    console.log("Got chat message with data: " + require('util').inspect(data))
    var client = getClientById(data.clientId);
    console.log("Client " + data.clientId + "("+ client.id + ") sent a message: " + data.message)
    var message = {
      name: client.name,
      message: data.message
    };
    sockets.forEach(function(_socket){
      _socket.emit('new message', message);
    });
  });
  socket.on('set name', function(data){
    var name = data.name;
    console.log("Setting name of client " + data.clientId + " to: " + name);

    var client = getClientById(data.clientId);
    client.name = name;
  });
});