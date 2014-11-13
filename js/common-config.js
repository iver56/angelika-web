angelika.config(function($httpProvider) {
  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;

  //Remove the header used to identify ajax call that would prevent CORS from working
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
  .run(function(AuthService, $compile, $rootScope) {
    var group = AuthService.tryLoginFromMemory();
    if (group) {
      if ('index.html' === window.currentPage) {
        if ('patients' === group) {
          window.location.href = 'user-dashboard.html';
        } else if ('health-professionals' === group) {
          window.location.href = 'dashboard.html';
        }
      } else if ('user-dashboard.html' === window.currentPage && 'health-professionals' === group) {
        window.location.href = 'dashboard.html';
      } else if ('dashboard.html' === window.currentPage && 'patients' === group) {
        window.location.href = 'user-dashboard.html';
      }
    } else if ('dashboard.html' === window.currentPage || 'user-dashboard.html' === window.currentPage) {
      window.location.href = 'index.html';
    }

    if (typeof dashboardLayout !== 'undefined') {
      dashboardLayout.on('componentCreated', function(e) {
        $compile(e.element)($rootScope);
      });
    }
  });
