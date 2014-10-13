angelikaControllers.controller('PatientGraphsCtrl', function($scope, $http, cfg) {
  $scope.chartRange = { days: 7 };

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
  var activityData;

  $scope.setChartWidths = function() {
    $scope.chartO2Config.options.chart.width = $("#container").width();
    $scope.chartHeartRateConfig.options.chart.width = $("#container").width();
    $scope.chartTempConfig.options.chart.width = $("#container").width();
    $scope.chartActivityConfig.options.chart.width = $("#container").width();
  };

  $http.get(cfg.apiUrl + "/measurements/?patient_id=1&type=O")
    .success(function(o2DataAPI) {
      o2Data = o2DataAPI.results;

      for (var i=0; i<o2Data.length; i++) {

        if (o2Data[i].y < o2Min) {
          o2Data[i].events = {
            click: function (e) {
              console.log(e);
              alert('test');
            }
          };

          o2Data[i].marker = {
            symbol: 'url(../../img/alert-icon.png)'
          };
        }
      };

      $scope.chartO2Config.series[0].data = o2Data;
    })
    .error(function(o2DataAPI, o2Status, o2Headers, o2Config) {
      console.log(o2DataAPI, o2Status, o2Headers, o2Config);
    });


  $http.get(cfg.apiUrl + "/measurements/?patient_id=1&type=P")
    .success(function(heartRateDataAPI) {
      heartRateData = heartRateDataAPI.results;

      for (var i=0; i<heartRateData.length; i++) {

        if (heartRateData[i].y < heartRateMin || heartRateData[i].y > heartRateMax) {
          heartRateData[i].events = {
            click: function (e) {
              console.log(e);
              alert('test');
            }
          };

          heartRateData[i].marker = {
            symbol: 'url(../../img/alert-icon.png)'
          };
        }
      };

      $scope.chartHeartRateConfig.series[0].data = heartRateData;
    })
    .error(function(heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig) {
      console.log(heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig);
    });


  $http.get(cfg.apiUrl + "/measurements/?patient_id=1&type=T")
    .success(function(tempDataAPI) {
      tempData = tempDataAPI.results;

      for (var i=0; i<tempData.length; i++) {

        if (tempData[i].y < tempMin || tempData[i].y > tempMax) {
          tempData[i].events = {
            click: function (e) {
              console.log(e);
              alert('test');
            }
          };

          tempData[i].marker = {
            symbol: 'url(../../img/alert-icon.png)'
          };
        }
      };

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
});
