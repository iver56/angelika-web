var angelika = angular.module(
  'angelika',
  [
    'angelika.controllers'
  ]
).config(function($httpProvider) {
    console.log('run config');
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });

var angelikaControllers = angular.module('angelika.controllers', []);
console.log('app.js loaded');
