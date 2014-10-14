var angelika = angular.module(
  'angelika',
  [
    'angelika.controllers',
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
  .run(function(AuthService) {
    var loggedIn = AuthService.tryLoginFromMemory();
    if (loggedIn) {
      if ('index.html' === getCurrentFileName()) {
        window.location.href = 'dashboard.html';
      }
    } else if ('dashboard.html' === getCurrentFileName()) {
      window.location.href = 'index.html';
    }
  });

var angelikaControllers = angular.module('angelika.controllers', []);
var angelikaServices = angular.module('angelika.services', []);

function getCurrentFileName(){
  var pagePathName = window.location.pathname;
  return pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
}

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
