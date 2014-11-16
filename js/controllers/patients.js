angelikaControllers.controller('PatientsCtrl', function($scope, $http, cfg, AuthService, LayoutUtils) {
  $scope.patients = [];
  $scope.searchHasFocus = false;

  function getPatients() {
    $scope.serverError = false;
    $scope.loadingPatients = true;

    $http.get(cfg.apiUrl + "/patients/?page_size=5000")
      .success(function(data) {
        $scope.patients = data.results;
        $scope.loadingPatients = false;
      })
      .error(function(data, status, headers, config) {
        $scope.serverError = true;
        $scope.loadingPatients = false;
      });
  }
  getPatients();

  $scope.openPatient = function(patient) {
    LayoutUtils.openPatient(patient);
  };

  dashboardLayout.on('patientsChanged', getPatients);
});
