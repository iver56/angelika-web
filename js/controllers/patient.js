angelikaControllers.controller('PatientCtrl', function($scope, $http, cfg, $q) {
  $scope.patientId = -1;
  $scope.patient = {};

  var asyncPatientId = $q.defer();
  $scope.init = function(resolve, reject) {
    if ($scope.patientId < 0) {
      console.error("Patient id is not specified!");
      asyncPatientId.reject($scope.patientId);
    } else {
      asyncPatientId.resolve($scope.patientId);
    }
  };
  $scope.getPatientId = function() {
    return asyncPatientId.promise;
  };

  var asyncPatient = $q.defer();
  $scope.getPatient = function() {
    return asyncPatient.promise;
  };
  $scope.getPatientId().then(function(patientId) {
    $http.get(cfg.apiUrl + "/patients/" + patientId + "/")
      .success(function(data) {
        asyncPatient.resolve(data);
      })
      .error(function(data, status, headers, config) {
        asyncPatient.reject(data);
        console.error(data, status, headers, config);
      });
  });
});
