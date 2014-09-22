angelikaControllers.controller('LoginCtrl', function($scope, $http, cfg) {
  console.log('LoginCtrl is running!');
  $scope.apiUrl = cfg.apiUrl;

  //Hello world (API)
  $http.get(cfg.apiUrl + "/alarms/")
    .success(function(data) {
      console.log("Yay, got data from the API!");
      console.log(data);
    })
    .error(function(data, status, headers, config) {
      console.log(data, status, headers, config);
    });
});
