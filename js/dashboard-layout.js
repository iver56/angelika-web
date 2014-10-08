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
          componentState: { template: 'left.html', controller: 'LeftCtrl' },
          width: 35,
          isClosable: false
        },
        {
          type: 'component',
          componentName: 'template',
          componentState: { template: 'right.html', controller: 'RightCtrl' }
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
  var templateHtml = '<div ng-include="\'templates/' + state.template + '\'" ng-controller="'
    + state.controller + '"></div>';
  console.log("loading template", templateHtml);
  container.getElement().html(templateHtml);
});

dashboardLayout.on('initialised', function() {
  angular.bootstrap(document.body, ['angelika']);
});

dashboardLayout.init();
