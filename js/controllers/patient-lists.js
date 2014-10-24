angelikaControllers.controller('PatientListsCtrl', function($scope) {
  $scope.getPatientO2Data().then(function(o2DataAPI) {
    $scope.o2Data = o2DataAPI.results;
    console.log($scope.o2Data);
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

  var toUTCDate = function(date){
    var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  var millisToUTCDate = function(millis){
    return toUTCDate(new Date(millis));
  };

  $scope.millisToUTCDate = millisToUTCDate;
});
