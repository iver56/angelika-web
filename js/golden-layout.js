angular.module( 'userModule', [] )
  .controller( 'user', function( $scope ){
    $scope.name = 'John Dee';
  })
  .controller( 'userDetails', function( $scope ){
    $scope.age = 38;
  });

myLayout = new GoldenLayout({
  settings:{
    hasHeaders: false
  },
  content:[{
    type: 'row',
    content: [{
      type: 'component',
      componentName: 'template',
      componentState: { templateId: 'userNameTemplate' }
    },{
      type: 'component',
      componentName: 'template',
      componentState: { templateId: 'userDetailTemplate' }
    }]
  }]
});

myLayout.registerComponent( 'template', function( container, state ){
  var templateHtml = $( '#' + state.templateId ).html();
  container.getElement().html( templateHtml );
});

myLayout.on( 'initialised', function(){
  angular.bootstrap( document.body, [ 'angelika' ]);
});

myLayout.init();
