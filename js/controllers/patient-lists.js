angelikaControllers.controller('PatientListsCtrl', function($scope, DateTimeHelper) {
  $scope.getPatientO2Data().then(function(o2DataAPI) {
    $scope.o2Data = o2DataAPI.results;
  });

  $scope.getPatientHeartRateData().then(function(heartRateDataAPI) {
    $scope.heartRateData = heartRateDataAPI.results;
  });

  $scope.getPatientTemperatureData().then(function(temperatureDataAPI) {
    $scope.temperatureData = temperatureDataAPI.results;
  });

  $scope.getPatientActivityData().then(function(activityDataAPI) {
    $scope.activityData = activityDataAPI.results;
  });

  $scope.millisToUTCDate = DateTimeHelper.millisToUTCDate;
});
