angelikaControllers.controller('PatientInfoCtrl', function($scope, $http, cfg, $modal) {
  $scope.loadingPatient = true;
  $scope.loadingAlarms = true;

  $scope.getPatient().then(function(patient) {
    $scope.patient = patient;

    if (patient.motivation_texts.length > 0) {
      $scope.newestMotivationalText = patient.motivation_texts[0].text;
      $scope.motivationalTextsCount = " (" + patient.motivation_texts.length + " totalt)";
    } else {
      $scope.newestMotivationalText = "Ingen motiverende tekster er skrevet inn";
      $scope.motivationalTextsCount = "";
    }

    if (patient.information_texts.length > 0) {
      $scope.newestInfoText = patient.information_texts[0].text;
      $scope.infoTextsCount = " (" + patient.information_texts.length + " totalt)";
    } else {
      $scope.newestInfoText = "Ingen informative tekster er skrevet inn";
      $scope.infoTextsCount = "";
    }
  }).finally(function() {
    $scope.loadingPatient = false;
  });

  $scope.getPatientId().then(function(patientId) {
    $http.get(cfg.apiUrl + "/alarms/?patient_id=" + patientId)
      .success(function(data) {
        $scope.alarms = data.results;
        $scope.loadingAlarms = false;
      })
      .error(function(data, status, headers, config) {
        console.error(data, status, headers, config);
        $scope.loadingAlarms = false;
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
    $http.post(
        cfg.apiUrl + "/alarms/" + $scope.alarm.id + "/handle/",
      {
        'alarm': $scope.alarm,
        'motivation_text': $scope.motivationalText
      }
    )
      .success(function(data) {
        $scope.posting = false;
        $modalInstance.close($scope.alarm);
      })
      .error(function(data) {
        $scope.posting = false;
        console.error(data);
        alert("Det oppstod en feil under lagring. Prøv igjen senere.");
      });
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
