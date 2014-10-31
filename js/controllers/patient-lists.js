angelikaControllers.controller('PatientListsCtrl', function($scope, DateTimeHelper) {
  $scope.getPatientO2Data().then(function(o2DataAPI) {
    $scope.o2Data = o2DataAPI.measurements;
  });

  $scope.getPatientHeartRateData().then(function(heartRateDataAPI) {
    $scope.heartRateData = heartRateDataAPI.measurements;
  });

  $scope.getPatientTemperatureData().then(function(temperatureDataAPI) {
    $scope.temperatureData = temperatureDataAPI.measurements;
  });

  $scope.getPatientActivityData().then(function(activityDataAPI) {
    $scope.activityData = activityDataAPI.measurements;
  });

  $scope.millisToUTCDate = DateTimeHelper.millisToUTCDate;

  $scope.openAlertHandling = function(measurement) {
    if (measurement.alert) {
      alert("test for opening alert handling");
    }
  }
});
