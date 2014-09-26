angelikaControllers.controller('AlarmsCtrl', function($scope, $http, cfg, AuthService, $state) {
  $scope.alarms = [];

  $http.get(cfg.apiUrl + "/alarms/")
    .success(function(data) {
      console.log(data);
      $scope.alarms = data.results;
    })
    .error(function(data, status, headers, config) {
      console.log(data, status, headers, config);
    });

  $scope.logOut = function() {
    AuthService.logout();
    $state.go('login');
  }
});
