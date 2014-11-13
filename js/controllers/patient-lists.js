angelikaControllers.controller('PatientListsCtrl', function($scope, DateTimeHelper, AlarmHelper) {
  $scope.measurementType = AlarmHelper.measurementType;
  $scope.measurementTypeUnit = AlarmHelper.measurementTypeUnit;
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

  $scope.millisToUTCDate = DateTimeHelper.millisToUTCDate;

  $scope.openAlertHandling = function(measurement) {
    if (measurement.alert) {
      console.log("test for opening alert handling");
    }
  }
});
