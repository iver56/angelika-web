angelikaDirectives.directive('draggablePatient', ['LayoutUtils', function(LayoutUtils) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var patient = scope.$eval(attrs.draggablePatient);
      var patientComponentConfig = LayoutUtils.getPatientConfig(
        patient.id,
        patient.user.full_name
      );
      if (!!patient) {
        dashboardLayout.createDragSource(element, patientComponentConfig);
      }
    }
  };
}]);
