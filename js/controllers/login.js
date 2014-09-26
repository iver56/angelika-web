angelikaControllers.controller('LoginCtrl', function($scope, AuthService, $state) {
  $scope.loginFailed = false;
  $scope.loginData = {
    username: "",
    password: ""
  };

  $scope.login = function() {
    AuthService.login($scope.loginData.username, $scope.loginData.password, function(data) {

      if (data.status === "success") {
        $state.go('alarms');
      } else {
        $scope.loginFailed = true;
      }

    });
  };
});
