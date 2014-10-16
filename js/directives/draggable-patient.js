angelikaDirectives.directive('draggablePatient', ['LayoutUtils', function(LayoutUtils) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var patientComponentConfig = LayoutUtils.getPatientConfig(
        scope.patient.id,
        scope.patient.user.full_name
      );
      dashboardLayout.createDragSource(element, patientComponentConfig);
    }
  };
}]);
