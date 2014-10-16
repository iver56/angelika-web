angelikaControllers.controller('PatientsCtrl', function($scope, $http, cfg, AuthService) {
  $scope.patients = [];

  $http.get(cfg.apiUrl + "/patients/")
    .success(function(data) {
      $scope.patients = data.results;
    })
    .error(function(data, status, headers, config) {
      console.error(data, status, headers, config);
    });

  $scope.openPatient = function(patient) {
    var patientComponentConfig = {
      type: 'component',
      title: patient.user.full_name,
      componentName: 'template',
      componentState: { template: 'patient.html', controller: 'PatientCtrl' }
    };
    dashboardLayout.getPatientParentComponent().addChild(patientComponentConfig);
  }
});
