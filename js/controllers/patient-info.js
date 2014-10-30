angelikaControllers.controller('PatientInfoCtrl', function($scope, $modal) {

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
  });

  //TODO: get this from the API
  $scope.alarms = [
    {
      time_created: "2014-10-10T06:08:51Z",
      is_treated: false,
      treated_text: "",
      value: 87,
      type: 'O',
      treated_text: ''
    },
    {
      time_created: "2014-10-01T01:49:34Z",
      is_treated: true,
      type: 'P',
      value: 110,
      treated_text: "Hjerteflimmer."
    },
    {
      time_created: "2014-09-22T22:04:07Z",
      is_treated: true,
      type: 'T',
      value: 38.4,
      treated_text: "Feber."
    },
    {
      time_created: "2014-09-03T10:28:07Z",
      is_treated: true,
      type: 'P',
      value: 98,
      treated_text: "Fall i trapp."
    }
  ];

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
        type = "o2-metning";
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
