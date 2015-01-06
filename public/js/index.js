var APP_NAME = "chatApp";
angular.module(APP_NAME, [
  'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize',
  'ngResource', 'ngRoute', 'ui.bootstrap'
]);

angular.module(APP_NAME).value('EVENT_NAMES', {
  SETUP: 'setup',
  SOCKET_DISCONNECTED: 'disconnect',
  NEW_MESSAGE: 'new message',
  CHAT_MESSAGE: 'chat message',
  SET_NAME: 'set name',
  USER_CONNECTED: 'user connected',
  USER_DISCONNECTED: 'user disconnected'
});


angular.module(APP_NAME).controller("MainCtrl", ['$scope', '$timeout','EVENT_NAMES','socket', 'alertsFactory', function($scope, $timeout, evt, socket, alertsFactory) {
  $scope.client = {};
  $scope.alerts = [];
  $scope.messages = [];
  $scope.usersConnected = [];

  $scope.socketConnected = false;
  $scope.tryingToReconnect = false;

  $scope.tryToReconnect = function(){
    $scope.tryingToReconnect = true;
    socket.connect(function(err){
      $scope.tryingToReconnect = false;
      if(!err){
        $scope.socketConnected = true;
      }
    });
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.changeName = function(){
    var name = $scope.name;
    $scope.name = "";
    socket.emit(evt.SET_NAME, {
      clientId: $scope.client.id,
      name: name
    }, function(data){
      $scope.client.name = data.name;
    });
  };

  $scope.sendMessage = function(){
    var msg = $scope.message;
    socket.emit(evt.CHAT_MESSAGE, {
      clientId: $scope.client.id,
      message: msg
    });
    $scope.message = "";
  };
  socket.on(evt.SOCKET_DISCONNECTED, function(){
    $scope.socketConnected = false;
  });

  socket.on(evt.SETUP, function(data){
    $scope.socketConnected = true;
    $scope.client.id = data.id;
    $scope.client.name = data.name;
  });

  socket.on(evt.NEW_MESSAGE, function(data){
    $scope.messages.push({author: data.name, txt: data.message});
  });

  socket.on(evt.USER_CONNECTED, function(user){
    $scope.usersConnected.push(user);
    // Not XSS safe
    var alert = alertsFactory.info("User connected! Say hello to: <b>" + user.name +"</b>.");
    console.log("USER_CONNECTED")
    console.log(alert)
    $scope.alerts.push(alert);
  });
  socket.on(evt.USER_DISCONNECTED, function(user){
    var position = null;

    for(var i=0; i<$scope.usersConnected.length; i++){
      var _user = $scope.usersConnected[i];
      if(user.id == _user.id){
        position = i;
        break;
      }
    }
    if(position !== null){
      $scope.usersConnected.splice(position, 1);
    }
    // Not XSS safe
    var alert = alertsFactory.info("User <b>" + user.name +"</b> disconnected.");
    $scope.alerts.push(alert);
  });
}]);

angular.module(APP_NAME).factory('socket', function($rootScope) {
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
});

angular.module(APP_NAME).factory('lodashFactory', function(){
  return _;
});

angular.module(APP_NAME).factory('alertsFactory', ['$rootScope', '$timeout', 'lodashFactory',function($rootScope, $timeout, _){
  var addAlert = function(type, msg) {
    var alert = {type: type, msg: msg, show: true};
    $timeout(function(){
      alert.show = false;
    }, 3000);
    return alert;
  };

  var curriedAlert = _.curry(addAlert);
  var addWarningAlert = curriedAlert('warning');
  var addInfoAlert = curriedAlert('info');
  var addSuccessAlert = curriedAlert('success');
  var addDangerAlert = curriedAlert('danger');

  return {
    addAlert: addAlert,
    warning: addWarningAlert,
    info: addInfoAlert,
    success: addSuccessAlert,
    danger: addDangerAlert
  };
}]);
