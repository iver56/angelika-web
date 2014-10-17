angelikaControllers.controller('PatientsCtrl', function($scope, $http, cfg, AuthService, LayoutUtils) {
  $scope.patients = [];

  $http.get(cfg.apiUrl + "/patients/")
    .success(function(data) {
      $scope.patients = data;
    })
    .error(function(data, status, headers, config) {
      console.error(data, status, headers, config);
    });

  $scope.openPatient = function(patient) {
    var patientComponentConfig = LayoutUtils.getPatientConfig(patient.id, patient.user.full_name);
    dashboardLayout.getPatientParentComponent().addChild(patientComponentConfig);
  }
});
