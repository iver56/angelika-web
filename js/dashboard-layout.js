dashboardLayout = new GoldenLayout({
  settings: {
    hasHeaders: false
  },
  content: [
    {
      type: 'row',
      content: [
        {
          type: 'component',
          componentName: 'template',
          componentState: { template: 'alarms.html' }
        },
        {
          type: 'component',
          componentName: 'template',
          componentState: { template: 'alarms.html' }
        }
      ]
    }
  ]
});

dashboardLayout.registerComponent('template', function(container, state) {
  var templateHtml = '<div ng-include="\'templates/' + state.template + '\'"></div>';
  container.getElement().html(templateHtml);
});

dashboardLayout.on('initialised', function() {
  angular.bootstrap(document.body, ['angelika']);
});

dashboardLayout.init();
