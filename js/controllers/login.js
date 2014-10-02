angelikaControllers.controller('LoginCtrl', function($scope, AuthService) {
  $scope.loginFailed = false;
  $scope.loginData = {
    username: "",
    password: ""
  };
  $scope.age = 38;

  $scope.login = function() {
    AuthService.login($scope.loginData.username, $scope.loginData.password, function(data) {

      if (data.status === "success") {
      } else {
        $scope.loginFailed = true;
      }

    });
  };
});
