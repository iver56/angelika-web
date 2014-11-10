angelikaControllers.controller('PatientCtrl', function($scope, $http, cfg, $q, $interval) {
  $scope.patientId = -1;
  $scope.patient = null;

  $scope.o2DataListeners = [];
  $scope.heartRateDataListeners = [];
  $scope.temperatureDataListeners = [];
  $scope.activityDataListeners = [];

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

  function periodicO2Poll() {
    $http.get(cfg.apiUrl + "/patients/" + $scope.patientId + "/graph_data/?type=O")
      .success(function(data) {
        for (var i = 0; i < $scope.o2DataListeners.length; i++) {
          $scope.o2DataListeners[i](data);
        }
      })
  }
  function periodicHeartRatePoll() {
    $http.get(cfg.apiUrl + "/patients/" + $scope.patientId + "/graph_data/?type=P")
      .success(function(data) {
        for (var i = 0; i < $scope.heartRateDataListeners.length; i++) {
          $scope.heartRateDataListeners[i](data);
        }
      })
  }
  function periodicTemperaturePoll() {
    $http.get(cfg.apiUrl + "/patients/" + $scope.patientId + "/graph_data/?type=T")
      .success(function(data) {
        for (var i = 0; i < $scope.temperatureDataListeners.length; i++) {
          $scope.temperatureDataListeners[i](data);
        }
      })
  }
  function periodicActivityPoll() {
    $http.get(cfg.apiUrl + "/patients/" + $scope.patientId + "/graph_data/?type=A")
      .success(function(data) {
        for (var i = 0; i < $scope.activityDataListeners.length; i++) {
          $scope.activityDataListeners[i](data);
        }
      })
  }

  function getRandomInterval() {
    return 22000 + 10000 * Math.random() | 0;
  }

  $scope.getPatientId().then(function(patientId) {
    $http.get(cfg.apiUrl + "/patients/" + patientId + "/")
      .success(function(data) {
        asyncPatient.resolve(data);
      })
      .error(function(data, status, headers, config) {
        asyncPatient.reject(data);
        console.error(data, status, headers, config);
      });

    $http.get(cfg.apiUrl + "/patients/" + patientId + "/graph_data/?type=O")
      .success(function(data) {
        asyncPatientO2Data.resolve(data);
        $interval(periodicO2Poll, getRandomInterval());
      })
      .error(function(data, status, headers, config) {
        asyncPatientO2Data.reject(data);
        console.error(data, status, headers, config);
      });

    $http.get(cfg.apiUrl + "/patients/" + patientId + "/graph_data/?type=P")
      .success(function(data) {
        asyncPatientHeartRateData.resolve(data);
        $interval(periodicHeartRatePoll, getRandomInterval());
      })
      .error(function(data, status, headers, config) {
        asyncPatientHeartRateData.reject(data);
        console.error(data, status, headers, config);
      });

    $http.get(cfg.apiUrl + "/patients/" + patientId + "/graph_data/?type=T")
      .success(function(data) {
        asyncPatientTemperatureData.resolve(data);
        $interval(periodicTemperaturePoll, getRandomInterval());
      })
      .error(function(data, status, headers, config) {
        asyncPatientTemperatureData.reject(data);
        console.error(data, status, headers, config);
      });

    $http.get(cfg.apiUrl + "/patients/" + patientId + "/graph_data/?type=A")
      .success(function(data) {
        asyncPatientActivityData.resolve(data);
        $interval(periodicActivityPoll, getRandomInterval());
      })
      .error(function(data, status, headers, config) {
        asyncPatientActivityData.reject(data);
        console.error(data, status, headers, config);
      });
  });
});
