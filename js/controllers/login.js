angelikaControllers.controller('LoginCtrl', function($scope, AuthService, $state) {
  $scope.loginData = {
    username: "",
    password: ""
  };

  $scope.login = function() {
    AuthService.login($scope.loginData.username, $scope.loginData.password, function(data) {
      console.log(data);
      $state.go('alarms');
    });
  };
});
