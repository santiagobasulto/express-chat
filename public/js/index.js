var APP_NAME = "chatApp";
angular.module(APP_NAME, [
  'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize',
  'ngResource', 'ngRoute', 'ui.bootstrap'
]);

angular.module(APP_NAME).value('EVENT_NAMES', {
  SETUP: 'setup',
  NEW_MESSAGE: 'new message',
  CHAT_MESSAGE: 'chat message',
  SET_NAME: 'set name'
});

angular.module(APP_NAME).controller("MainCtrl", ['$scope', 'EVENT_NAMES','socket', function($scope, evt, socket) {
  $scope.client = {}
  $scope.messages = [];

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
