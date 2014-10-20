angelikaControllers.controller('AlarmsCtrl', function($scope, $http, cfg, AlarmHelper, LayoutUtils) {
  $scope.alarms = [];
  $scope.measurementType = AlarmHelper.measurementType;

  $http.get(cfg.apiUrl + "/alarms/")
    .success(function(data) {
      $scope.alarms = data.results;
    })
    .error(function(data, status, headers, config) {
      console.error(data, status, headers, config);
    });

  $scope.openPatient = function(patient) {
    var patientComponentConfig = LayoutUtils.getPatientConfig(patient.id, patient.user.full_name);
    dashboardLayout.getPatientParentComponent().addChild(patientComponentConfig);
  }
});
