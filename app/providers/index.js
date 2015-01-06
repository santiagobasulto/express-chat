var angular = require('angular');
var APP_NAME = "chatApp";

angular.module(APP_NAME)
  .factory("socketFactory", require("./socketFactory"))
  .factory("lodashFactory", require("./lodashFactory"))
  .factory("alertsFactory", require("./alertsFactory"));
