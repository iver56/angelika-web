angelikaControllers.controller('PatientListsCtrl', function($scope, DateTimeHelper) {
  $scope.lists = [
    {
      header: 'O2-metning',
      data: [],
      loading: true,
      loadingFailed: false,
      showThresholdValues: true,
      dateFormat: 'dd.M.yyyy kl. H.mm',
      unit: '%'
    },
    {
      header: 'Puls',
      data: [],
      loading: true,
      loadingFailed: false,
      showThresholdValues: true,
      dateFormat: 'dd.M.yyyy kl. H.mm',
      unit: 'slag/min'
    },
    {
      header: 'Temperatur',
      data: [],
      loading: true,
      loadingFailed: false,
      showThresholdValues: true,
      dateFormat: 'dd.M.yyyy kl. H.mm',
      unit: '°C'
    },
    {
      header: 'Aktivitet',
      data: [],
      loading: true,
      loadingFailed: false,
      showThresholdValues: false,
      dateFormat: 'dd.M.yyyy',
      unit: 'skritt/dag'
    }
  ];

  $scope.shouldShow = function(list) {
    if ($scope.patient) {
      if ('O2-metning' === list.header && $scope.patient.show_o2
        || 'Puls' === list.header && $scope.patient.show_pulse
        || 'Temperatur' === list.header && $scope.patient.show_temperature
        || 'Aktivitet' === list.header && $scope.patient.show_activity) {
        return true;
      }
    }
    return false;
  };

  $scope.getThresholdValue = function(list, isUpperThreshold) {
    if (!$scope.patient) {
      return null;
    }
    if ('O2-metning' === list.header) {
      if (isUpperThreshold) {
        return $scope.patient.o2_max;
      } else {
        return $scope.patient.o2_min;
      }
    } else if ('Puls' === list.header) {
      if (isUpperThreshold) {
        return $scope.patient.pulse_max;
      } else {
        return $scope.patient.pulse_min;
      }
    } else if ('Temperatur' === list.header) {
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
