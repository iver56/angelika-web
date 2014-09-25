var angelika = angular.module(
  'angelika',
  [
    'angelika.controllers',
    'angelika.services',
    'ui.bootstrap',
    'ui.router'
  ]
).config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('alarms', {
        url: '/alarms',
        templateUrl: 'templates/alarms.html',
        controller: 'AlarmsCtrl'
      })
    ;
    $urlRouterProvider.otherwise('/login');
  });

var angelikaControllers = angular.module('angelika.controllers', []);
var angelikaServices = angular.module('angelika.services', []);
