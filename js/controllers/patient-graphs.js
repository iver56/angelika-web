angelikaControllers.controller('PatientGraphsCtrl', function($scope, $timeout) {
  $scope.tabSelected = function() {
    $scope.setChartWidths();
  };

  $scope.chartO2Series = [
    {"name": "O2-metning"}
  ];

  var commonChartConfig = {
    options: {
      chart: {
        type: 'spline'
      },
      credits: {
        enabled: false
      },
      title: {},
      xAxis: {
        type: 'datetime',
        minTickInterval: 24 * 3600 * 1000
      },
      yAxis: {
        title: {}
      },
      plotOptions: {
        series: {
          lineWidth: 3
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y} </b>',
        xDateFormat: '%A %d.%m.%Y kl. %H:%M'
      }/*,
       rangeSelector: {
       enabled: true
       }*/
    },
    series: $scope.chartO2Series
  };

  // Set common config for all charts
  $scope.chartO2Config = angular.copy(commonChartConfig);
  $scope.chartHeartRateConfig = angular.copy(commonChartConfig);
  $scope.chartTempConfig = angular.copy(commonChartConfig);
  $scope.chartActivityConfig = angular.copy(commonChartConfig);

  // Set chart titles
  $scope.chartO2Config.options.title.text = "O2-metning";
  $scope.chartHeartRateConfig.options.title.text = "Puls";
  $scope.chartTempConfig.options.title.text = "Temperatur";
  $scope.chartActivityConfig.options.title.text = "Aktivitet";

  // Set tooltip suffixes
  $scope.chartO2Config.options.tooltip.valueSuffix = " %";
  $scope.chartHeartRateConfig.options.tooltip.valueSuffix = " slag/min";
  $scope.chartTempConfig.options.tooltip.valueSuffix = " °C";
  $scope.chartActivityConfig.options.tooltip.valueSuffix = " skritt/dag";

  // Y-axis titles
  $scope.chartO2Config.options.yAxis.title.text = "O2-metning (prosent)";
  $scope.chartHeartRateConfig.options.yAxis.title.text = "Puls (slag pr. minutt)";
  $scope.chartTempConfig.options.yAxis.title.text = "Temperatur (°C)";
  $scope.chartActivityConfig.options.yAxis.title.text = "Aktivitet (Skritt pr. minutt";

  // Y-axis max
  $scope.chartO2Config.options.yAxis.max = 100;

  // Plot bands
  $scope.chartO2Config.options.yAxis.plotBands = [{
    // Critically low value
    color: 'rgba(245,127,127,0.2)',
    from: '0',
    to: '90' // Fetch from normal values
  },{
    // Green OK area:
    color: 'rgba(125,235,121,0.2)',
    from: '90', // Fetch from normal values
    to: '100'
  }];

  $scope.chartHeartRateConfig.options.yAxis.plotBands = [{
    // Critically low value:
    color: 'rgba(245,127,127,0.2)',
    from: '0',
    to: '60' // Fetch from normal values
  },{
    // Green OK area:
    color: 'rgba(125,235,121,0.2)',
    from: '60', // Fetch from normal values
    to: '90' // Fetch from normal values
  },{
    // Critically high value:
    color: 'rgba(245,127,127,0.2)',
    from: '90', // Fetch from normal values
    to: '200' // Fetch from normal values
  }];

  $scope.chartTempConfig.options.yAxis.plotBands = [{
    // Critically low value:
    color: 'rgba(245,127,127,0.2)',
    from: '0',
    to: '36' // Fetch from normal values
  },{
    // Green OK area:
    color: 'rgba(125,235,121,0.2)',
    from: '36', // Fetch from normal values
    to: '39' // Fetch from normal values
  },{
    // Critically high value:
    color: 'rgba(245,127,127,0.2)',
    from: '39', // Fetch from normal values
    to: '50' // Fetch from normal values
  }];

  var setData = function() {
    $scope.chartO2Config.series[0].data = [
      [Date.UTC(2013,  8, 1), 92   ],
      [Date.UTC(2013,  9, 1), 88   ],
      [Date.UTC(2013, 10, 1), 89   ],
      [Date.UTC(2013, 11, 1), 95   ],
      [Date.UTC(2014,  0, 1), 94   ],
      [Date.UTC(2014,  1, 1), 91   ],
      [Date.UTC(2014,  2, 1), 87   ],
      [Date.UTC(2014,  3, 1), 95   ],
      [Date.UTC(2014,  4, 1), 94   ],
      [Date.UTC(2014,  5, 1), 96   ],
      [Date.UTC(2014,  6, 1), 93   ],
      [Date.UTC(2014,  7, 1), 95   ],
      [Date.UTC(2014,  8, 1), 93   ],
      [Date.UTC(2014,  9, 1), 87   ],
      [Date.UTC(2014,  9, 2), 95   ],
      [Date.UTC(2014,  9, 3), 94   ],
      [Date.UTC(2014,  9, 4), 96   ],
      [Date.UTC(2014,  9, 5), 93   ],
      [Date.UTC(2014,  9, 6), 95   ],
      [Date.UTC(2014,  9, 7), 93   ],
      [Date.UTC(2014,  9, 8), 87   ],
      [Date.UTC(2014,  9, 9), 93   ],
      [Date.UTC(2014,  9, 10), 90   ]
    ];

    $scope.chartHeartRateConfig.series[0].data = [
      [Date.UTC(2013,  8, 1), 65   ],
      [Date.UTC(2013,  9, 1), 71   ],
      [Date.UTC(2013, 10, 1), 69   ],
      [Date.UTC(2013, 11, 1), 73   ],
      [Date.UTC(2014,  0, 1), 75   ],
      [Date.UTC(2014,  1, 1), 77   ],
      [Date.UTC(2014,  2, 1), 70   ],
      [Date.UTC(2014,  3, 1), 76   ],
      [Date.UTC(2014,  4, 1), 72   ],
      [Date.UTC(2014,  5, 1), 68   ],
      [Date.UTC(2014,  6, 1), 75   ],
      [Date.UTC(2014,  7, 1), 78   ],
      [Date.UTC(2014,  8, 1), 81   ],
      [Date.UTC(2014,  9, 1), 80   ],
      [Date.UTC(2014,  9, 2), 82   ],
      [Date.UTC(2014,  9, 3), 79   ],
      [Date.UTC(2014,  9, 4), 76   ],
      [Date.UTC(2014,  9, 5), 75   ],
      [Date.UTC(2014,  9, 6), 79   ],
      [Date.UTC(2014,  9, 7), 80   ],
      [Date.UTC(2014,  9, 8), 76   ],
      [Date.UTC(2014,  9, 9), 74   ],
      [Date.UTC(2014,  9, 10), 73   ]
    ];

    $scope.chartTempConfig.series[0].data = [
      [Date.UTC(2013,  8, 1), 37.1   ],
      [Date.UTC(2013,  9, 1), 37.3   ],
      [Date.UTC(2013, 10, 1), 37.2   ],
      [Date.UTC(2013, 11, 1), 37.8   ],
      [Date.UTC(2014,  0, 1), 37.5   ],
      [Date.UTC(2014,  1, 1), 37.9   ],
      [Date.UTC(2014,  2, 1), 38.2   ],
      [Date.UTC(2014,  3, 1), 38.5   ],
      [Date.UTC(2014,  4, 1), 38.9   ],
      [Date.UTC(2014,  5, 1), 39.2   ],
      [Date.UTC(2014,  6, 1), 39.3   ],
      [Date.UTC(2014,  7, 1), 38.8   ],
      [Date.UTC(2014,  8, 1), 38.4   ],
      [Date.UTC(2014,  9, 1), 38.3   ],
      [Date.UTC(2014,  9, 2), 38.0   ],
      [Date.UTC(2014,  9, 3), 37.5   ],
      [Date.UTC(2014,  9, 4), 37.3   ],
      [Date.UTC(2014,  9, 5), 37.4   ],
      [Date.UTC(2014,  9, 6), 37.2   ],
      [Date.UTC(2014,  9, 7), 37.0   ],
      [Date.UTC(2014,  9, 8), 37.1   ],
      [Date.UTC(2014,  9, 9), 36.8   ],
      [Date.UTC(2014,  9, 10), 36.9   ]
    ];

    $scope.chartActivityConfig.series[0].data = [
      [Date.UTC(2013,  8, 1), 920   ],
      [Date.UTC(2013,  9, 1), 880   ],
      [Date.UTC(2013, 10, 1), 890   ],
      [Date.UTC(2013, 11, 1), 950   ],
      [Date.UTC(2014,  0, 1), 940   ],
      [Date.UTC(2014,  1, 1), 910   ],
      [Date.UTC(2014,  2, 1), 870   ],
      [Date.UTC(2014,  3, 1), 950   ],
      [Date.UTC(2014,  4, 1), 940   ],
      [Date.UTC(2014,  5, 1), 960   ],
      [Date.UTC(2014,  6, 1), 930   ],
      [Date.UTC(2014,  7, 1), 950   ],
      [Date.UTC(2014,  8, 1), 930   ],
      [Date.UTC(2014,  9, 1), 870   ],
      [Date.UTC(2014,  9, 2), 950   ],
      [Date.UTC(2014,  9, 3), 940   ],
      [Date.UTC(2014,  9, 4), 960   ],
      [Date.UTC(2014,  9, 5), 930   ],
      [Date.UTC(2014,  9, 6), 950   ],
      [Date.UTC(2014,  9, 7), 930   ],
      [Date.UTC(2014,  9, 8), 870   ],
      [Date.UTC(2014,  9, 9), 930   ],
      [Date.UTC(2014,  9, 10), 900   ]
    ];
  };

  $scope.setChartWidths = function() {
    $scope.chartO2Config.options.chart.width = $("#container").width();
    $scope.chartHeartRateConfig.options.chart.width = $("#container").width();
    $scope.chartTempConfig.options.chart.width = $("#container").width();
    $scope.chartActivityConfig.options.chart.width = $("#container").width();
  };

  $timeout(setData, 1000);

  $scope.setChartRange = function($days) {
    var now = new Date().getTime();
    var msPerDay = 86400000;
    var min = now - (msPerDay * $days);

    $scope.chartO2Config.options.xAxis.min = min;
    $scope.chartHeartRateConfig.options.xAxis.min = min;
    $scope.chartTempConfig.options.xAxis.min = min;
    $scope.chartActivityConfig.options.xAxis.min = min;

    $scope.chartO2Config.options.xAxis.max = now;
    $scope.chartHeartRateConfig.options.xAxis.max = now;
    $scope.chartTempConfig.options.xAxis.max = now;
    $scope.chartActivityConfig.options.xAxis.max = now;
  }
});
