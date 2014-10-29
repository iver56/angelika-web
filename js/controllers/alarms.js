angelikaControllers.controller('AlarmsCtrl', function($scope, $http, $timeout, cfg, AlarmHelper, LayoutUtils) {
  $scope.alarms = [];
  $scope.measurementType = AlarmHelper.measurementType;

  (function tick() {
    $http.get(cfg.apiUrl + "/alarms/")
      .success(function(data) {
        $scope.alarms = data.results;
        $timeout(tick, 5000);
      })
      .error(function(data, status, headers, config) {
        console.error(data, status, headers, config);
        $timeout(tick, 20000);
      });
  })();

  $scope.openPatient = function(patient) {
    LayoutUtils.openPatient(patient);
  }
});
