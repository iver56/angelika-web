angelikaControllers.controller('PatientCtrl', function($scope, $http, cfg, $q) {
  $scope.patientId = -1;
  $scope.patient = null;

  var asyncPatientId = $q.defer();
  $scope.init = function() {
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

  var asyncPatientO2Data = $q.defer();
  $scope.getPatientO2Data = function() {
    return asyncPatientO2Data.promise;
  };

  var asyncPatientHeartRateData = $q.defer();
  $scope.getPatientHeartRateData = function() {
    return asyncPatientHeartRateData.promise;
  };

  var asyncPatientTemperatureData = $q.defer();
  $scope.getPatientTemperatureData = function() {
    return asyncPatientTemperatureData.promise;
  };

  var asyncPatientActivityData = $q.defer();
  $scope.getPatientActivityData = function() {
    return asyncPatientActivityData.promise;
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

    $http.get(cfg.apiUrl + "/patients/" + patientId + "/graph_data/"+ "?type=O")
      .success(function(data) {
        asyncPatientO2Data.resolve(data);
      })
      .error(function(data, status, headers, config) {
        asyncPatientO2Data.reject(data);
        console.error(data, status, headers, config);
      });

    $http.get(cfg.apiUrl + "/patients/" + patientId + "/graph_data/"+ "?type=P")
      .success(function(data) {
        asyncPatientHeartRateData.resolve(data);
      })
      .error(function(data, status, headers, config) {
        asyncPatientHeartRateData.reject(data);
        console.error(data, status, headers, config);
      });

    $http.get(cfg.apiUrl + "/patients/" + patientId + "/graph_data/"+ "?type=T")
      .success(function(data) {
        asyncPatientTemperatureData.resolve(data);
      })
      .error(function(data, status, headers, config) {
        asyncPatientTemperatureData.reject(data);
        console.error(data, status, headers, config);
      });

    $http.get(cfg.apiUrl + "/patients/" + patientId + "/graph_data/"+ "?type=A")
      .success(function(data) {
        asyncPatientActivityData.resolve(data);
      })
      .error(function(data, status, headers, config) {
        asyncPatientActivityData.reject(data);
        console.error(data, status, headers, config);
      });
  });
});
