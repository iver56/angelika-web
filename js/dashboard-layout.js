dashboardLayout = new GoldenLayout({
  labels: {
    close: 'Lukk',
    maximise: 'Maksimer',
    minimise: 'Minimer',
    popout: 'Åpne i nytt vindu'
  },
  dimensions: {
    minItemWidth: 350,
    minItemHeight: 200,
    dragProxyWidth: 350,
    dragProxyHeight: 200,
    headerHeight: 30
  },
  content: [
    {
      type: 'stack',
      isClosable: false,
      content: [
        {
          type: 'component',
          componentName: 'template',
          title: '<span class="glyphicon glyphicon-bell"></span> Varsler',
          componentState: { template: 'alarms.html', controller: 'AlarmsCtrl' },
          isClosable: false
        },
        {
          type: 'component',
          componentName: 'template',
          title: '<span class="glyphicon glyphicon-search"></span> Brukere',
          componentState: { template: 'patients.html', controller: 'PatientsCtrl' },
          isClosable: false
        },
        {
          type: 'component',
          componentName: 'template',
          title: '<span class="glyphicon glyphicon-cog"></span> Innstillinger',
          componentState: { template: 'settings.html', controller: 'SettingsCtrl' },
          isClosable: false
        }
      ]
    }
  ]
});

dashboardLayout.registerComponent('template', function(container, state) {
  if (typeof state.template !== 'string') {
    console.error('state.template must be specified and must be a string');
  }
  if (typeof state.controller !== 'string') {
    console.error('state.controller must be specified and must be a string');
  }

  var templateHtml = '<div'
    + ' ng-include="\'templates/' + state.template + '\'"'
    + ' ng-controller="' + state.controller + '"'
    + (state.patientId ? ' ng-init="patientId = ' + state.patientId + '; init()"' : '')
    + '></div>';

  container.getElement().html(templateHtml);

});

dashboardLayout.on('initialised', function() {
  angular.bootstrap(document.body, ['angelika']);
});

dashboardLayout.init();

dashboardLayout.getPatientParentComponent = function() {
  return dashboardLayout.root.contentItems[0];
};

dashboardLayout.on('tabCreated', function(tab) {
  if (tab.contentItem.config.componentState.patientId) {
    tab.element.attr('data-patient-id', tab.contentItem.config.componentState.patientId);
  }
});
