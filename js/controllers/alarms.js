angelikaControllers.controller('AlarmsCtrl', function($scope, $http, cfg) {
  $scope.alarms = [];

  $scope.name = 'John Dee';

  $http.get(cfg.apiUrl + "/alarms/")
    .success(function(data) {
      $scope.alarms = data.results;
    })
    .error(function(data, status, headers, config) {
      console.error(data, status, headers, config);
    });
});
