angelikaControllers.controller('UsersCtrl', function($scope, $http, cfg, AuthService) {
  $scope.users = [];

  $http.get(cfg.apiUrl + "/patients/")
    .success(function(data) {
      console.log(data);
      $scope.users = data.results;
    })
    .error(function(data, status, headers, config) {
      console.log(data, status, headers, config);
    });
});
