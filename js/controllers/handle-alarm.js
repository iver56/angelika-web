angelikaControllers.controller('HandleAlarmCtrl', function($scope, $modalInstance, $http, cfg, alarm, editMode, patient, AlarmHelper) {
  $scope.alarm = alarm;
  $scope.alarm.is_treated = true;
  $scope.posting = false;
  $scope.motivationalText = {
    text: ''
  };
  $scope.editMode = editMode;
  $scope.measurementType = AlarmHelper.measurementType;
  $scope.alarmReason = AlarmHelper.alarmReason;
  $scope.measurementTypeUnit = AlarmHelper.measurementTypeUnit;

  $scope.ok = function() {
    $scope.posting = true;
    $http.post(
        cfg.apiUrl + "/alarms/" + $scope.alarm.id + "/handle/",
      {
        'alarm': $scope.alarm,
        'motivation_text': $scope.motivationalText
      }
    )
      .success(function(data) {
        $scope.posting = false;
        dashboardLayout.emit('handledAlarm', $scope.alarm);
        $modalInstance.close(data);
      })
      .error(function(data) {
        $scope.posting = false;
        alert("Det oppstod en feil under lagring. Prøv igjen senere.");
      });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };


  $scope.getLowerThresholdValue = function() {
    if ('O' === $scope.alarm.measurement.type) {
      return patient.o2_min;
    } else if ('P' === $scope.alarm.measurement.type) {
      return patient.pulse_min;
    } else if ('T' === $scope.alarm.measurement.type) {
      return patient.temperature_min;
    }
    return null;
  };

  $scope.getUpperThresholdValue = function() {
    if ('O' === $scope.alarm.measurement.type) {
      return patient.o2_max;
    } else if ('P' === $scope.alarm.measurement.type) {
      return patient.pulse_max;
    } else if ('T' === $scope.alarm.measurement.type) {
      return patient.temperature_max;
    }
    return null;
  };
});
