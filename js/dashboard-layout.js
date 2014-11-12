dashboardLayout = new GoldenLayout({
  labels: {
    close: 'Lukk',
    maximise: 'Maksimer',
    minimise: 'Minimer',
    popout: 'Åpne i nytt vindu'
  },
  dimensions: {
    minItemWidth: 370,
    minItemHeight: 200,
    dragProxyWidth: 500,
    dragProxyHeight: 300,
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
          title: '<span class="glyphicon glyphicon-bell"></span> Varsler <span class="badge alarms-badge"></span>',
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

  var templateHtml = '<div class="component"'
    + ' ng-include="\'templates/' + state.template + '\'"'
    + ' ng-controller="' + state.controller + '"'
    + (state.patientId ? ' ng-init="patientId = ' + state.patientId + '; init()"' : '')
    + '></div>';

  if (state.patientId) {
    container.on('resize', function() {
      if (container.width > 0 && container.height > 0) {
        dashboardLayout.emit('resizePatient' + state.patientId, container.width, container.height);
      }
    });
  }

  container.getElement().html(templateHtml);
});

dashboardLayout.on('initialised', function() {
  angular.bootstrap(document.body, ['angelika']);
});

dashboardLayout.init();

dashboardLayout.getPatientParentComponent = function() {
  return dashboardLayout.root.contentItems[0];
};
