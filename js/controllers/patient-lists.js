angelikaControllers.controller('PatientListsCtrl', function($scope, DateTimeHelper) {
  $scope.loadingO2Data = true;
  $scope.loadingO2DataFailed = false;
  $scope.loadingHeartRateData = true;
  $scope.loadingHeartRateDataFailed = false;

  function showO2Data(o2DataAPI) {
    $scope.o2Data = o2DataAPI.measurements;
  }
  function showHeartRateData(heartRateDataAPI) {
    $scope.heartRateData = heartRateDataAPI.measurements;
  }
  function showTemperatureData(temperatureDataAPI) {
    $scope.temperatureData = temperatureDataAPI.measurements;
  }
  function showActivityData(activityDataAPI) {
    $scope.activityData = activityDataAPI.measurements;
  }

  $scope.o2DataListeners.push(showO2Data);
  $scope.heartRateDataListeners.push(showHeartRateData);
  $scope.temperatureDataListeners.push(showTemperatureData);
  $scope.activityDataListeners.push(showActivityData);

  $scope.getPatientO2Data().then(showO2Data).catch(function() {
    $scope.loadingO2DataFailed = true;
  }).finally(function() {
    $scope.loadingO2Data = false;
  });

  $scope.getPatientHeartRateData().then(showHeartRateData).catch(function() {
    $scope.loadingHeartRateDataFailed = true;
  }).finally(function() {
    $scope.loadingHeartRateData = false;
  });

  $scope.getPatientTemperatureData().then(showTemperatureData).catch(function() {
    $scope.loadingTemperatureDataFailed = true;
  }).finally(function() {
    $scope.loadingTemperatureData = false;
  });

  $scope.getPatientActivityData().then(showActivityData).catch(function() {
    $scope.loadingActivityDataFailed = true;
  }).finally(function() {
    $scope.loadingActivityData = false;
  });
  $scope.millisToUTCDate = DateTimeHelper.millisToUTCDate;

  $scope.openAlertHandling = function(measurement) {
    if (measurement.alert) {
      console.log("test for opening alert handling");
    }
  }
});
