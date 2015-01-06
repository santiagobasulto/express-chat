var _ = require('lodash');

var angular = require('angular');
require('angular-animate');
require('angular-cookies');
require('angular-touch');
require('angular-sanitize');
require('angular-resource');
require('angular-route');
require('ui-bootstrap');

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

require('./controllers/index.js');
require('./providers/index.js');
