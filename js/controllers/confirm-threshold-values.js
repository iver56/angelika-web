angelikaControllers.controller('ConfirmThresholdValuesCtrl', function($scope, $modalInstance, patientBeforeChanges, patient, changedThresholdValues, AlarmHelper) {
  $scope.changedThresholdValues = changedThresholdValues;
  $scope.patientBeforeChanges = patientBeforeChanges;
  $scope.patient = patient;
  $scope.measurementTypeUnit = AlarmHelper.measurementTypeUnit;

  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
