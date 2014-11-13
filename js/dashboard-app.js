var angelika = angular.module(
  'angelika',
  [
    'angelika.controllers',
    'angelika.directives',
    'angelika.services',
    'highcharts-ng',
    'ui.bootstrap',
    'ui.validate'
  ]
);


var angelikaControllers = angular.module('angelika.controllers', []);
var angelikaDirectives = angular.module('angelika.directives', []);
var angelikaServices = angular.module('angelika.services', []);

createjs.Sound.alternateExtensions = ["ogg"];
createjs.Sound.registerSound("snd/notify.mp3", "notify");
