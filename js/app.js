var angelika = angular.module(
  'angelika',
  [
    'angelika.controllers',
    'angelika.services',
    'ui.bootstrap'
  ]
).config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });

var angelikaControllers = angular.module('angelika.controllers', []);
var angelikaServices = angular.module('angelika.services', []);
