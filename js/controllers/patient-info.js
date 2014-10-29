angelikaControllers.controller('PatientInfoCtrl', function($scope, $http, cfg, $modal) {

  $scope.getPatient().then(function(patient) {
    $scope.patient = patient;
  });

  $scope.getPatientId().then(function(patientId) {
    $http.get(cfg.apiUrl + "/alarms/?patient_id=" + patientId)
      .success(function(data) {
        $scope.alarms = data.results;
      })
      .error(function(data, status, headers, config) {
        console.error(data, status, headers, config);
      });
  });

  $scope.open = function(size, idx) {
    var modalInstance = $modal.open({
      templateUrl: 'handleAlertModalContent.html',
      controller: 'handleAlertModalInstanceCtrl',
      size: size,
      resolve: {
        alarm: function() {
          return angular.copy($scope.alarms[idx]);
        },
        patient: function() {
          return $scope.patient;
        }
      }
    });
    modalInstance.result.then(function(alarm) {
      $scope.alarms[idx] = alarm;
    });
  };


});

angelikaControllers.controller('handleAlertModalInstanceCtrl', function($scope, $modalInstance, $http, cfg, alarm, patient) {
  $scope.alarm = alarm;
  $scope.posting = false;
  $scope.motivationalText = {
    text: ''
  };
  $scope.tag = {
    text: ''
  };

  $scope.ok = function() {
    if ($scope.motivationalText.text && $scope.motivationalText.text !== "") {
      $scope.posting = true;
      patient.motivation_texts.push({
        id: null,
        text: $scope.motivationalText.text
      });
      $http.patch(cfg.apiUrl + "/patients/" + patient.id + "/", patient)
        .success(function(patientDB) {
          for (var property in patientDB) {
            if (patientDB.hasOwnProperty(property) && patient.hasOwnProperty(property)) {
              patient[property] = patientDB[property];
            }
          }
          $scope.posting = false;
          $modalInstance.close($scope.alarm);
        })
        .error(function(data) {
          $scope.posting = false;
          console.error(data);
          //TODO: Replace by a proper error message
          alert("Det oppstod en feil under lagring. Prøv igjen.");
        });
    } else {
      console.log("Close, nothing saved");
      $modalInstance.close($scope.alarm);
    }
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.getAlertType = function(typeChar) {
    //TODO: compare value to normal value
    var highOrLow = "lav ";
    var type;
    switch (typeChar) {
      case "O":
        type = "O2-metning";
        break;
      case "P":
        type = "puls";
        break;
      case "T":
        type = "temperatur";
        break;
    }
    return "Unormalt " + highOrLow + type;
  };

  $scope.getNormalValue = function(type, time) {
    //TODO: get old normal value

    return "89% - 100%";
  }
});
