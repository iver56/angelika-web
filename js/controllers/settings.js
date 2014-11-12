angelikaControllers.controller('SettingsCtrl', function($scope, AuthService, LayoutUtils) {
  $scope.newPatient = function() {
    var newPatientComponentConfig = LayoutUtils.getNewPatientConfig();
    dashboardLayout.getPatientParentComponent().addChild(newPatientComponentConfig);
  };

  $scope.logOut = function() {
    AuthService.logOut();
    window.location.href = 'index.html';
  };

  $scope.isSoundOn = { value: (simpleStorage.get('isSoundOn') ? 1 : 0) };
  $scope.setSoundSetting = function() {
    simpleStorage.set('isSoundOn', $scope.isSoundOn.value, {TTL: 157700000000 /*five years*/});
  };

  $scope.filterAlarms = { value: (simpleStorage.get('filterAlarms') ? 1 : 0) };
  $scope.setFilterAlarmsSetting = function() {
    simpleStorage.set('filterAlarms', $scope.filterAlarms.value, {TTL: 157700000000 /*five years*/});
  };
});
