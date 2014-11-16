angelikaControllers.controller('PatientInfoCtrl', function($scope, $http, cfg, $modal, AlarmHelper, $sce) {
  $scope.loadingPatient = true;
  $scope.loadingAlarms = true;
  $scope.nextOfKinLimit = 1;
  $scope.measurementType = AlarmHelper.measurementType;
  $scope.alarmReason = AlarmHelper.alarmReason;
  $scope.alarms = [];
  $scope.trustAsResourceUrl = $sce.trustAsResourceUrl;

  $scope.showAllNextOfKin = function() {
    $scope.nextOfKinLimit = 999;
  };

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

  dashboardLayout.on('handledAlarm', function(alarm) {
    for (var i = 0; i < $scope.alarms.length; i++) {
      if ($scope.alarms[i].id === alarm.id) {
        $scope.alarms[i] = alarm;
        return;
      }
    }
  });

  $scope.open = function(size, idx) {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/handle-alarm.html',
      controller: 'HandleAlarmCtrl',
      size: size,
      resolve: {
        alarm: function() {
          return angular.copy($scope.alarms[idx]);
        },
        editMode: function() {
          return $scope.alarms[idx].is_treated ? true : false
        },
        patient: function() {
          return $scope.patient
        }
      }
    });
    modalInstance.result.then(function(data) {
      $scope.alarms[idx] = data.alarm;
      if (data.motivation_text.id) {
        $scope.patient.motivation_texts.push(data.motivation_text);
      }
    });
  };
});
