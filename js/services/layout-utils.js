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

  this.openPatient = function(patient) {
    var foundIdx = -1;
    for (var i = 3; i < dashboardLayout.getPatientParentComponent().contentItems.length; i++) {
      var config = dashboardLayout.getPatientParentComponent().contentItems[i].config;
      if (config.isClosable && config.componentState.patientId == patient.id) {
        foundIdx = i;
      }
    }

    if (foundIdx > 0) {
      dashboardLayout.getPatientParentComponent().setActiveContentItem(dashboardLayout.getPatientParentComponent().contentItems[foundIdx]);
    } else {
      var patientComponentConfig = this.getPatientConfig(patient.id, patient.user.full_name);
      dashboardLayout.getPatientParentComponent().addChild(patientComponentConfig);
    }
  };
});
