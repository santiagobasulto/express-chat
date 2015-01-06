var dependencies = ['$scope', '$timeout','EVENT_NAMES','socketFactory', 'alertsFactory'];

var MainCtrl = function($scope, $timeout, evt, socket, alertsFactory) {
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
};

module.exports = exports = dependencies.concat([MainCtrl]);
