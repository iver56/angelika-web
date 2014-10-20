angelikaDirectives.directive('draggablePatient', ['LayoutUtils', function(LayoutUtils) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var patient = scope.$eval(attrs.draggablePatient);
      if (!!patient) {
        var patientComponentConfig = LayoutUtils.getPatientConfig(
          patient.id,
          patient.user.full_name
        );
        dashboardLayout.createDragSource(element, patientComponentConfig);
      }
    }
  };
}]);
