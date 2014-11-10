angelikaControllers.controller('SettingsCtrl', function($scope, AuthService, LayoutUtils) {
  $scope.newPatient = function() {
    var newPatientComponentConfig = LayoutUtils.getNewPatientConfig();
    dashboardLayout.getPatientParentComponent().addChild(newPatientComponentConfig);
  };

  $scope.logOut = function() {
    AuthService.logOut();
    window.location.href = 'index.html';
  };
});
