angelikaControllers.controller('PatientsCtrl', function($scope, $http, cfg, AuthService, LayoutUtils) {
  $scope.patients = [];

  $http.get(cfg.apiUrl + "/patients/")
    .success(function(data) {
      $scope.patients = data.results;
    })
    .error(function(data, status, headers, config) {
      console.error(data, status, headers, config);
    });

  $scope.openPatient = function(patient) {
    LayoutUtils.openPatient(patient);
  };

  $scope.newPatient = function() {
    var newPatientComponentConfig = LayoutUtils.getNewPatientConfig();
    dashboardLayout.getPatientParentComponent().addChild(newPatientComponentConfig);
  };
});
