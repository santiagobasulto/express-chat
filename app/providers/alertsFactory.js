var dependencies = ['$rootScope', '$timeout', 'lodashFactory'];

var alertsFactory = function($rootScope, $timeout, _){
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
};

module.exports = exports = dependencies.concat([alertsFactory]);
