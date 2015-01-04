var APP_NAME = "chatApp";
angular.module(APP_NAME, [
  'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize',
  'ngResource', 'ngRoute', 'ui.bootstrap'
]);

angular.module(APP_NAME).value('EVENT_NAMES', {
  SETUP: 'setup',
  NEW_MESSAGE: 'new message',
  CHAT_MESSAGE: 'chat message',
  SET_NAME: 'set name',
  USER_CONNECTED: 'user connected',
  USER_DISCONNECTED: 'user disconnected'
});

angular.module(APP_NAME).controller("MainCtrl", ['$scope', '$timeout','EVENT_NAMES','socket', function($scope, $timeout, evt, socket) {
  $scope.client = {}
  $scope.alerts = [];
  $scope.messages = [];
  $scope.usersConnected = [];

  var LAST_ALERT_ID = 1;
  var removeAlertById = function(_id){
    var position = null;

    for(var i=0; i<$scope.alerts.length; i++){
      var alert = $scope.alerts[i];
      if(alert.id == _id){
        position = i;
        break;
      }
    }
    if(position !== null){
      $scope.alerts.splice(position, 1);
    }
  };
  var addAlert = function(type, msg) {
    var _id = LAST_ALERT_ID++;
    $scope.alerts.push({id: _id, type: type, msg: msg});
    $timeout(function(){
      removeAlertById(_id);
    }, 3000)
  };

  var curriedAlert = _.curry(addAlert)
  var addWarningAlert = curriedAlert('warning')
  var addInfoAlert = curriedAlert('info')
  var addSuccessAlert = curriedAlert('success')
  var addDangerAlert = curriedAlert('danger')

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
  }

  $scope.sendMessage = function(){
    var msg = $scope.message;
    socket.emit(evt.CHAT_MESSAGE, {
      clientId: $scope.client.id,
      message: msg
    });
    $scope.message = "";
  }

  socket.on(evt.SETUP, function(data){
    $scope.client.id = data.id;
    $scope.client.name = data.name;
  });

  socket.on(evt.NEW_MESSAGE, function(data){
    $scope.messages.push({author: data.name, txt: data.message})
  });

  socket.on(evt.USER_CONNECTED, function(user){
    $scope.usersConnected.push(user);
    addInfoAlert("User connected! Say hello to: <b>" + user.name +"</b>.")
  })
  socket.on(evt.USER_DISCONNECTED, function(user){
    var position = null;

    for(var i=0; i<$scope.usersConnected.length; i++){
      var _user = $scope.usersConnected[i]
      if(user.id == _user.id){
        position = i;
        break;
      }
    }
    if(position !== null){
      $scope.usersConnected.splice(position, 1);
    }
    addInfoAlert("User <b>" + user.name +"</b> disconnected.")
  })


}]);

angular.module(APP_NAME).factory('socket', function ($rootScope) {
  var socket = io();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
