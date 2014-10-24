var angelika = angular.module(
  'angelika',
  [
    'angelika.controllers',
    'angelika.directives',
    'angelika.services',
    'highcharts-ng',
    'ui.bootstrap'
  ]
).config(function($httpProvider) {
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
      }else if ('dashboard.html' === window.currentPage && 'patients' === group) {
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

var angelikaControllers = angular.module('angelika.controllers', []);
var angelikaDirectives = angular.module('angelika.directives', []);
var angelikaServices = angular.module('angelika.services', []);

Highcharts.setOptions({
  lang: {
    loading: 'Laster inn...',
    months: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
    shortMonths: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
    weekdays: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
    exportButtonTitle: "Eksporter",
    printChart: 'Skriv ut',
    rangeSelectorFrom: 'Fra',
    rangeSelectorTo: 'Til',
    rangeSelectorZoom: 'Zoom',
    resetZoom: 'Tilbakestill zoom',
    resetZoomTitle: 'Tilbakestill zoom',
    downloadJPEG: 'Lagre som bilde (JPG)',
    downloadPNG: 'Lagre som bilde (PNG)',
    downloadPDF: 'Lagre som PDF',
    downloadSVG: 'Lagre som vektorgrafikk (SVG)',
    thousandsSep: '.',
    decimalPoint: ',',
    contextButtonTitle: null,
    numericSymbols: null
  }
});
