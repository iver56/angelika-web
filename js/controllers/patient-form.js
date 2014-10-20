angelikaControllers.controller('PatientFormCtrl', function($scope, $http, cfg) {
  $scope.getPatient().then(function(patient) {
    $scope.patient = patient;
  });

  $scope.save = function() {
    $http.patch(cfg.apiUrl + "/patients/" + $scope.patientId + "/", $scope.patient)
      .success(function(data) {
        console.log(data);
      })
      .error(function(data) {
        console.error(data);
      });
  };

});
