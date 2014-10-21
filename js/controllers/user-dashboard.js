angelikaControllers.controller('UserDashboardCtrl', function($scope, $http, cfg, AuthService) {
  $scope.name = "Ola Nordmann";
  $scope.motivationalMsg = "Motiverende melding skrevet av helsepersonell kommer her.";
  $scope.otherMsg = "Annen informasjon skrevet av helsepersonell kommer her.";

  $scope.chartRange = { days: 7 };

  $scope.tabSelected = function() {
    $scope.setChartWidths();
  };

  var commonChartConfig = {
    options: {
      chart: {
        type: 'spline'
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        minTickInterval: 24 * 3600 * 1000,
        labels: {
          style: {
            fontSize:'18px'
          }
        }
      },
      yAxis: {
        title: {
          style: {
            fontSize:'18px'
          }
        },
        labels: {
          style: {
            fontSize:'18px'
          }
        }
      },
      plotOptions: {
        series: {
          lineWidth: 3
        }
      },
      exporting: {
        enabled: false
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
    series: [
      {"name": ""}
    ]
  };

  // Set common config for all charts
  $scope.chartO2Config = angular.copy(commonChartConfig);
  $scope.chartHeartRateConfig = angular.copy(commonChartConfig);
  $scope.chartTempConfig = angular.copy(commonChartConfig);
  $scope.chartActivityConfig = angular.copy(commonChartConfig);

  // Set tooltip suffixes
  $scope.chartO2Config.options.tooltip.valueSuffix = " %";
  $scope.chartHeartRateConfig.options.tooltip.valueSuffix = " slag/min";
  $scope.chartTempConfig.options.tooltip.valueSuffix = " °C";
  $scope.chartActivityConfig.options.tooltip.valueSuffix = " skritt/dag";

  // Y-axis titles
  $scope.chartO2Config.options.yAxis.title.text = "O2-metning (prosent)";
  $scope.chartHeartRateConfig.options.yAxis.title.text = "Puls (slag pr. minutt)";
  $scope.chartTempConfig.options.yAxis.title.text = "Temperatur (°C)";
  $scope.chartActivityConfig.options.yAxis.title.text = "Aktivitet (Skritt pr. dag)";

  // Y-axis max
  $scope.chartO2Config.options.yAxis.max = 100;

  // Plot bands

  // Normal values, to be fetched from api
  var o2Min = 90;
  var heartRateMin = 60;
  var heartRateMax = 90;
  var tempMin = 36;
  var tempMax = 39;

  $scope.chartO2Config.options.yAxis.plotBands = [{
    // Critically low value
    color: 'rgba(245,127,127,0.2)',
    from: '0',
    to: o2Min
  },{
    // Green OK area:
    color: 'rgba(125,235,121,0.2)',
    from: o2Min,
    to: '100'
  }];

  $scope.chartHeartRateConfig.options.yAxis.plotBands = [{
    // Critically low value:
    color: 'rgba(245,127,127,0.2)',
    from: '0',
    to: heartRateMin
  },{
    // Green OK area:
    color: 'rgba(125,235,121,0.2)',
    from: heartRateMin,
    to: heartRateMax
  },{
    // Critically high value:
    color: 'rgba(245,127,127,0.2)',
    from: heartRateMax,
    to: '200' // Fetch from normal values
  }];

  $scope.chartTempConfig.options.yAxis.plotBands = [{
    // Critically low value:
    color: 'rgba(245,127,127,0.2)',
    from: '0',
    to: tempMin
  },{
    // Green OK area:
    color: 'rgba(125,235,121,0.2)',
    from: tempMin,
    to: tempMax
  },{
    // Critically high value:
    color: 'rgba(245,127,127,0.2)',
    from: tempMax,
    to: '50' // Fetch from normal values
  }];

  var o2Data;
  var heartRateData;
  var tempData;

  $scope.setChartWidths = function() {
    $scope.chartO2Config.options.chart.width = $("#charts").width();
    $scope.chartHeartRateConfig.options.chart.width = $("#charts").width();
    $scope.chartTempConfig.options.chart.width = $("#charts").width();
    $scope.chartActivityConfig.options.chart.width = $("#charts").width();
  };

  $http.get(cfg.apiUrl + "/measurements/?patient_id=1&type=O")
    .success(function(o2DataAPI) {
      o2Data = o2DataAPI.results;
      $scope.chartO2Config.series[0].data = o2Data;
    })
    .error(function(o2DataAPI, o2Status, o2Headers, o2Config) {
      console.log(o2DataAPI, o2Status, o2Headers, o2Config);
    });


  $http.get(cfg.apiUrl + "/measurements/?patient_id=1&type=P")
    .success(function(heartRateDataAPI) {
      heartRateData = heartRateDataAPI.results;
      $scope.chartHeartRateConfig.series[0].data = heartRateData;
    })
    .error(function(heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig) {
      console.log(heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig);
    });


  $http.get(cfg.apiUrl + "/measurements/?patient_id=1&type=T")
    .success(function(tempDataAPI) {
      tempData = tempDataAPI.results;
      $scope.chartTempConfig.series[0].data = tempData;
    })
    .error(function(tempDataAPI, tempStatus, tempHeaders, tempConfig) {
      console.log(tempDataAPI, tempStatus, tempHeaders, tempConfig);
    });


  $http.get(cfg.apiUrl + "/measurements/?patient_id=1&type=A")
    .success(function(activityDataAPI) {
      $scope.chartActivityConfig.series[0].data = activityDataAPI.results;
    })
    .error(function(activityDataAPI, activityStatus, activityHeaders, activityConfig) {
      console.log(activityDataAPI, activityStatus, activityHeaders, activityConfig);
    });


  $scope.updateChartRange = function() {
    var now = new Date().getTime();
    var msPerDay = 86400000;
    var min = now - (msPerDay * $scope.chartRange.days);

    $scope.chartO2Config.options.xAxis.min = min;
    $scope.chartHeartRateConfig.options.xAxis.min = min;
    $scope.chartTempConfig.options.xAxis.min = min;
    $scope.chartActivityConfig.options.xAxis.min = min;

    $scope.chartO2Config.options.xAxis.max = now;
    $scope.chartHeartRateConfig.options.xAxis.max = now;
    $scope.chartTempConfig.options.xAxis.max = now;
    $scope.chartActivityConfig.options.xAxis.max = now;
  };

  $scope.updateChartRange();

  $scope.logOut = function() {
    AuthService.logOut();
    window.location.href = 'index.html';
  }
});
