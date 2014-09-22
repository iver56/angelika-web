angelikaControllers.controller('LoginCtrl', function($scope, $http, cfg) {
  console.log('LoginCtrl is running!');
  $scope.alarms = [];

  //Hello world (API)
  $http.get(cfg.apiUrl + "/alarms/")
    .success(function(data) {
      console.log("Yay, got data from the API!");
      console.log(data);
      $scope.alarms = data.results;
    })
    .error(function(data, status, headers, config) {
      console.log(data, status, headers, config);
    });
});
