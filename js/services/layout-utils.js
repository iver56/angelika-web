angelikaServices.service('LayoutUtils', function() {
  this.getPatientConfig = function(patientId, patientName) {
    return {
      type: 'component',
      componentName: 'template',
      title: patientName,
      componentState: {
        template: 'patient.html',
        controller: 'PatientCtrl',
        patientId: patientId
      }
    }
  };
});
