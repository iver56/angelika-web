angelikaControllers.controller('AlarmsCtrl', function($scope, $http, $timeout, cfg, AlarmHelper, LayoutUtils) {
  $scope.alarms = [];
  $scope.alerts = [];
  $scope.measurementType = AlarmHelper.measurementType;
  $scope.loadingAlarms = true;

  $scope.playNotifySound = function() {
    if (simpleStorage.get('isSoundOn')) {
      createjs.Sound.play("notify");
    }
  };

  var connectionLost = false;
  $scope.oldAlarms = {};

  function setOldAlarms(list) {
    $scope.oldAlarms = {};
    for (var i = 0; i < list.length; i++) {
      $scope.oldAlarms[list[i].id] = true;
    }
  }

  function tick() {
    $http.get(cfg.apiUrl + "/alarms/")
      .success(function(data) {
        $scope.loadingAlarms = false;
        $scope.popAlert();
        if (connectionLost) {
          $scope.addAlert("server-connection-reestablished");
          connectionLost = false;
        }

        $scope.alarms = data.results;

        if ($scope.assessNewAlarms()) {
          $scope.playNotifySound();
        }

        setOldAlarms($scope.alarms);
        $timeout(tick, 5000);
      })
      .error(function(data, status, headers, config) {
        $scope.loadingAlarms = false;
        connectionLost = true;
        $scope.addAlert("server-connection-lost");
        console.error(data, status, headers, config);
        $timeout(tick, 20000);
      });
  }

  tick();

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
        $scope.alerts.push({ type: 'danger', msg: 'Kommunikasjon med server feilet, nye alarmer vil ikke vises.'});
        break;
      case "server-connection-reestablished":
        $scope.alerts.push({ type: 'success', msg: 'Kommunikasjon med server gjenopprettet, nye alarmer vil vises.'});
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
  }
});
