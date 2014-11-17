angelikaControllers.controller('AlarmsCtrl', function($scope, $http, $timeout, cfg, AlarmHelper, LayoutUtils, SoundRecorder) {
  $scope.alarms = [];
  $scope.alerts = [];
  $scope.measurementType = AlarmHelper.measurementType;
  $scope.alarmReason = AlarmHelper.alarmReason;
  $scope.loadingAlarms = true;
  $scope.connectionLost = false;
  $scope.oldAlarms = {};
  $scope.tickPromise = null;

  $scope.playNotifySound = function() {
    if (simpleStorage.get('isSoundOn')) {
      createjs.Sound.play("notify");
    }
  };

  function setOldAlarms(list) {
    $scope.oldAlarms = {};
    for (var i = 0; i < list.length; i++) {
      $scope.oldAlarms[list[i].id] = true;
    }
  }

  function updateNumUntreatedAlarmsBadge(assumeSorted) {
    var numUntreatedAlarms = getNumUntreatedAlarms(assumeSorted);
    $('.alarms-badge').text(numUntreatedAlarms > 0 ? numUntreatedAlarms : '');
  }

  function tick() {
    if (SoundRecorder.isRecording) {
      return;
    }
    var url = cfg.apiUrl + "/alarms/";
    if (simpleStorage.get('filterAlarms')) {
      url += "?only_untreated=1";
    }
    $scope.loadingAlarms = true;
    $http.get(url)
      .success(function(data) {
        $scope.loadingAlarms = false;
        $scope.popAlert();
        if ($scope.connectionLost) {
          $scope.addAlert("server-connection-reestablished");
          $scope.connectionLost = false;
        }

        $scope.alarms = data.results;

        if ($scope.assessNewAlarms()) {
          $scope.playNotifySound();
        }

        updateNumUntreatedAlarmsBadge(true);

        setOldAlarms($scope.alarms);
        $scope.tickPromise = $timeout(tick, 5000);
      })
      .error(function(data, status, headers, config) {
        $scope.loadingAlarms = false;
        $scope.connectionLost = true;
        $scope.addAlert("server-connection-lost");
        console.error(data, status, headers, config);
        $scope.tickPromise = $timeout(tick, 20000);
      });
  }

  function getNumUntreatedAlarms(assumeSorted) {
    var result = 0;
    for (var i = 0; i < $scope.alarms.length; i++) {
      if (!$scope.alarms[i].is_treated) {
        result++;
      } else if (assumeSorted) {
        break;
      }
    }
    return result;
  }

  tick();

  dashboardLayout.on('handledAlarm', function(alarm) {
    for (var i = 0; i < $scope.alarms.length; i++) {
      if ($scope.alarms[i].id === alarm.id) {
        $scope.alarms[i].is_treated = alarm.is_treated;
        updateNumUntreatedAlarmsBadge(false);
        return;
      }
    }
  });

  $scope.openPatient = function(patient) {
    LayoutUtils.openPatient(patient);
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.addAlert = function(alertType) {
    $scope.alerts.pop();
    switch (alertType) {
      case "server-connection-lost":
        $scope.alerts.push({ type: 'danger', msg: 'Kommunikasjon med server feilet. Prøver å gjenopprette forbindelsen...'});
        break;
      case "server-connection-reestablished":
        $scope.alerts.push({ type: 'success', msg: 'Kommunikasjon med server gjenopprettet'});
        break;
    }
  };

  $scope.popAlert = function() {
    $scope.alerts.pop();
  };

  $scope.assessNewAlarms = function() {
    if ($.isEmptyObject($scope.oldAlarms)) {
      return false;
    }
    for (var i = 0; i < $scope.alarms.length; i++) {
      var alarm = $scope.alarms[i];
      if (!$scope.oldAlarms.hasOwnProperty(alarm.id) && !alarm.is_treated) {
        return true;
      }
    }
    return false;
  };

  dashboardLayout.on('filterAlarmsSettingChanged', function() {
    if (!$scope.loadingAlarms) {
      $timeout.cancel($scope.tickPromise);
      tick();
    }
  });
});
