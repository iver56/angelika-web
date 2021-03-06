angelikaControllers.controller('PatientListsCtrl', function($scope, DateTimeHelper, AlarmHelper, $modal, $http, cfg) {
  $scope.measurementType = AlarmHelper.measurementType;
  $scope.measurementTypeUnit = AlarmHelper.measurementTypeUnit;
  $scope.timestampToDate = DateTimeHelper.timestampToDate;

  $scope.lists = [
    {
      type: 'O',
      data: [],
      loading: true,
      loadingFailed: false,
      showThresholdValues: true,
      dateFormat: 'dd.M.yyyy kl. H.mm',
      limitTo: 15
    },
    {
      type: 'P',
      data: [],
      loading: true,
      loadingFailed: false,
      showThresholdValues: true,
      dateFormat: 'dd.M.yyyy kl. H.mm',
      limitTo: 15
    },
    {
      type: 'T',
      data: [],
      loading: true,
      loadingFailed: false,
      showThresholdValues: true,
      dateFormat: 'dd.M.yyyy kl. H.mm',
      limitTo: 15
    },
    {
      type: 'A',
      data: [],
      loading: true,
      loadingFailed: false,
      showThresholdValues: false,
      dateFormat: 'dd.M.yyyy',
      limitTo: 15
    }
  ];

  $scope.incrementLimitTo = function(list) {
    list.limitTo += 200;
  };

  $scope.shouldShow = function(list) {
    if ($scope.patient) {
      if ('O' === list.type && $scope.patient.show_o2
        || 'P' === list.type && $scope.patient.show_pulse
        || 'T' === list.type && $scope.patient.show_temperature
        || 'A' === list.type && $scope.patient.show_activity) {
        return true;
      }
    }
    return false;
  };

  $scope.getThresholdValue = function(list, isUpperThreshold) {
    if (!$scope.patient) {
      return null;
    }
    if ('O' === list.type) {
      if (isUpperThreshold) {
        return $scope.patient.o2_max;
      } else {
        return $scope.patient.o2_min;
      }
    } else if ('P' === list.type) {
      if (isUpperThreshold) {
        return $scope.patient.pulse_max;
      } else {
        return $scope.patient.pulse_min;
      }
    } else if ('T' === list.type) {
      if (isUpperThreshold) {
        return $scope.patient.temperature_max;
      } else {
        return $scope.patient.temperature_min;
      }
    }
    return null;
  };

  $scope.getPatient().then(function(patient) {
    $scope.patient = patient;
  });

  function showO2Data(o2DataAPI) {
    $scope.lists[0].data = o2DataAPI.measurements;
  }

  function showHeartRateData(heartRateDataAPI) {
    $scope.lists[1].data = heartRateDataAPI.measurements;
  }

  function showTemperatureData(temperatureDataAPI) {
    $scope.lists[2].data = temperatureDataAPI.measurements;
  }

  function showActivityData(activityDataAPI) {
    $scope.lists[3].data = activityDataAPI.measurements;
  }

  $scope.o2DataListeners.push(showO2Data);
  $scope.heartRateDataListeners.push(showHeartRateData);
  $scope.temperatureDataListeners.push(showTemperatureData);
  $scope.activityDataListeners.push(showActivityData);

  $scope.getPatientO2Data().then(showO2Data).catch(function() {
    $scope.lists[0].loadingFailed = true;
  }).finally(function() {
    $scope.lists[0].loading = false;
  });

  $scope.getPatientHeartRateData().then(showHeartRateData).catch(function() {
    $scope.lists[1].loadingFailed = true;
  }).finally(function() {
    $scope.lists[1].loading = false;
  });

  $scope.getPatientTemperatureData().then(showTemperatureData).catch(function() {
    $scope.lists[2].loadingFailed = true;
  }).finally(function() {
    $scope.lists[2].loading = false;
  });

  $scope.getPatientActivityData().then(showActivityData).catch(function() {
    $scope.lists[3].loadingFailed = true;
  }).finally(function() {
    $scope.lists[3].loading = false;
  });

  $scope.openAlarmModal = function(alarm) {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/handle-alarm.html',
      controller: 'HandleAlarmCtrl',
      size: null,
      resolve: {
        alarm: function() {
          return angular.copy(alarm);
        },
        editMode: function() {
          return alarm.is_treated ? true : false
        },
        patient: function() {
          return $scope.patient
        }
      }
    });
    modalInstance.result.then(function(data) {
      if (data.motivation_text.id) {
        $scope.patient.motivation_texts.push(data.motivation_text);
      }
    });
  };

  $scope.handleAlarm = function(measurement) {
    if (measurement.alarm) {
      measurement.loading = true;
      $http.get(cfg.apiUrl + "/alarms/" + measurement.alarm.id + "/")
        .success(function(alarm) {
          measurement.loading = false;
          $scope.openAlarmModal(alarm);
        })
        .error(function(data) {
          measurement.loading = false;
          alert('Kunne ikke laste informasjon om varselet knyttet til målingen du klikket på');
        });
    }
  };
});
