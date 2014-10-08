angelikaControllers.controller('LeftCtrl', function($scope, AuthService) {
  $scope.logOut = function() {
    AuthService.logOut();
    window.location.href = 'index.html';
  }
});
