var io = require('socket.io-client');

var socketFactory = function($rootScope) {
  var socket = io({
    reconnection: false
  });
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
    connect: function(callback){
      socket.io.connect(callback);
    },
    _socket: socket
  };
};

module.exports = exports = ['$rootScope', socketFactory];
