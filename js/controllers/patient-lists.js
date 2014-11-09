angelikaControllers.controller('PatientListsCtrl', function($scope, DateTimeHelper) {
  $scope.loadingO2Data = true;
  $scope.loadingO2DataFailed = false;
  $scope.loadingHeartRateData = true;
  $scope.loadingHeartRateDataFailed = false;

  $scope.getPatientO2Data().then(function(o2DataAPI) {
    $scope.o2Data = o2DataAPI.measurements;
  }).catch(function() {
    $scope.loadingO2DataFailed = true;
  }).finally(function() {
    $scope.loadingO2Data = false;
  });

  $scope.getPatientHeartRateData().then(function(heartRateDataAPI) {
    $scope.heartRateData = heartRateDataAPI.measurements;
  }).catch(function() {
    $scope.loadingHeartRateDataFailed = true;
  }).finally(function() {
    $scope.loadingHeartRateData = false;
  });

  $scope.getPatientTemperatureData().then(function(temperatureDataAPI) {
    $scope.temperatureData = temperatureDataAPI.measurements;
  }).catch(function() {
    $scope.loadingTemperatureDataFailed = true;
  }).finally(function() {
    $scope.loadingTemperatureData = false;
  });

  $scope.getPatientActivityData().then(function(activityDataAPI) {
    $scope.activityData = activityDataAPI.measurements;
  }).catch(function() {
    $scope.loadingActivityDataFailed = true;
  }).finally(function() {
    $scope.loadingActivityData = false;
  });
  $scope.millisToUTCDate = DateTimeHelper.millisToUTCDate;

  $scope.openAlertHandling = function(measurement) {
    if (measurement.alert) {
      alert("test for opening alert handling");
    }
  }
});
