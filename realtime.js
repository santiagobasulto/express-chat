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
    console.log("Connection established");
    sockets.push(socket);

    var client = {
      id: getClientId(),
      name: getRandomName()
    };
    connectedClients[client.id] = client;

    socket.emit('setup', client);
    var onChatMessage = function (data) {
      console.log("Got chat message with data: " + require('util').inspect(data))
      var client = getClientById(data.clientId);
      console.log("Client " + data.clientId + "("+ client.id + ") sent a message: " + data.message)
      var message = {
        name: client.name,
        message: data.message
      };
      io.emit('new message', message);
    };
    var onSetName = function(data, callback){
      var name = data.name;
      console.log("Setting name of client " + data.clientId + " to: " + name);

      var client = getClientById(data.clientId);
      client.name = name;
      callback(data);
    }

    socket.on('chat message', onChatMessage);
    socket.on('set name', onSetName);
  }

  io.on('connection', onConnection);
}
