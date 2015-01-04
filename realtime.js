var logger = require('./logger')

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

var sockets = [];

exports.setup = function(io){
  var onConnection = function (socket) {
    logger.info("Connection established with socket", { socket: socket.id })
    sockets.push(socket);

    var client = {
      id: getClientId(),
      name: getRandomName()
    };
    connectedClients[client.id] = client;

    socket.emit('setup', client);
    socket.broadcast.emit('user connected', client)

    var onChatMessage = function (data) {
      var client = getClientById(data.clientId);
      var message = {
        name: client.name,
        message: data.message
      };
      io.emit('new message', message);
    };
    var onSetName = function(data, callback){
      var name = data.name;
      var client = getClientById(data.clientId);
      client.name = name;
      callback(data);
    }
    socket.on('disconnect', function(){
      logger.debug("Socket disconnected", {client: client})
      io.sockets.emit('user disconnected', client);
    })

    socket.on('chat message', onChatMessage);
    socket.on('set name', onSetName);
  }

  io.on('connection', onConnection);
}
