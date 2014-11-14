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
      var patientName = patient.user.full_name || patient.user.first_name + " " + patient.user.last_name;
      var patientComponentConfig = this.getPatientConfig(patient.id, patientName);
      dashboardLayout.getPatientParentComponent().addChild(patientComponentConfig);
    }
  };

  this.getNewPatientConfig = function() {
    return {
      type: 'component',
      componentName: 'template',
      title: 'Ny bruker',
      componentState: {
        template: 'patient-form.html',
        controller: 'PatientFormCtrl',
        padding: true
      }
    }
  };
});
