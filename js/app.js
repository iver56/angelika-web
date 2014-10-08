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
  })
  .run(function(AuthService) {
    var loggedIn = AuthService.tryLoginFromMemory();
    if (loggedIn) {
      if ('index.html' === getCurrentFileName()) {
        window.location.href = 'dashboard.html';
      }
    } else if ('dashboard.html' === getCurrentFileName()) {
      window.location.href = 'index.html';
    }
  });

var angelikaControllers = angular.module('angelika.controllers', []);
var angelikaServices = angular.module('angelika.services', []);

function getCurrentFileName(){
  var pagePathName = window.location.pathname;
  return pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
}
