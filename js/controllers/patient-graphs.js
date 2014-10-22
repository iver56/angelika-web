angelikaControllers.controller('PatientGraphsCtrl', function ($scope, $http, cfg) {
  $scope.chartRange = { days: 7 };

  $scope.tabSelected = function () {
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
    series: [
      {"name": ""}
    ]
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
  $scope.chartActivityConfig.options.yAxis.title.text = "Aktivitet (Skritt pr. dag)";

  // Y-axis max
  $scope.chartO2Config.options.yAxis.max = 100;

  var o2Min;
  var heartRateMin;
  var heartRateMax;
  var tempMin;
  var tempMax;

  // Normal values
  $scope.getPatient().then(function (patient) {
    o2Min = patient.o2_min;
    heartRateMin = patient.pulse_min;
    heartRateMax = patient.pulse_max;
    tempMin = patient.temperature_min;
    tempMax = patient.temperature_max;
  });

  var o2Data;
  var heartRateData;
  var temperatureData;
  var alertIconUrl = 'url(../../img/alert-icon.png)';

  $scope.setChartWidths = function () {
    var width = $("#charts").width();
    $scope.chartO2Config.options.chart.width = width;
    $scope.chartHeartRateConfig.options.chart.width = width;
    $scope.chartTempConfig.options.chart.width = width;
    $scope.chartActivityConfig.options.chart.width = width;
  };

  $scope.getPatientId().then(function (patientId) {
    $http.get(cfg.apiUrl + "/measurements/?patient_id=" + patientId + "&type=O")
      .success(function (o2DataAPI) {
        o2Data = o2DataAPI.results;

        for (var i = 0; i < o2Data.length; i++) {

          if (o2Data[i].y < o2Min) {
            o2Data[i].events = {
              click: function (e) {
                console.log(e);
                alert('test');
              }
            };
            o2Data[i].marker = {
              symbol: alertIconUrl
            };
          }
        }
        ;
        $scope.chartO2Config.series[0].data = o2Data;
        setPlotBands($scope.chartO2Config, o2Min, null);
      })
      .error(function (o2DataAPI, o2Status, o2Headers, o2Config) {
        console.log(o2DataAPI, o2Status, o2Headers, o2Config);
      });


    $http.get(cfg.apiUrl + "/measurements/?patient_id=" + patientId + "&type=P")
      .success(function (heartRateDataAPI) {
        heartRateData = heartRateDataAPI.results;

        for (var i = 0; i < heartRateData.length; i++) {

          if (heartRateData[i].y < heartRateMin || heartRateData[i].y > heartRateMax) {
            heartRateData[i].events = {
              click: function (e) {
                console.log(e);
                alert('test');
              }
            };
            heartRateData[i].marker = {
              symbol: alertIconUrl
            };
          }
        }
        ;
        $scope.chartHeartRateConfig.series[0].data = heartRateData;
        setPlotBands($scope.chartHeartRateConfig, heartRateMin, heartRateMax);
      })
      .error(function (heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig) {
        console.log(heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig);
      });


    $http.get(cfg.apiUrl + "/measurements/?patient_id=" + patientId + "&type=T")
      .success(function (temperatureDataAPI) {
        temperatureData = temperatureDataAPI.results;

        for (var i = 0; i < temperatureData.length; i++) {

          if (temperatureData[i].y < tempMin || temperatureData[i].y > tempMax) {
            temperatureData[i].events = {
              click: function (e) {
                console.log(e);
                alert('test');
              }
            };
            temperatureData[i].marker = {
              symbol: alertIconUrl
            };
          }
        }
        ;
        $scope.chartTempConfig.series[0].data = temperatureData;
        setPlotBands($scope.chartTempConfig, tempMin, tempMax);
      })
      .error(function (tempDataAPI, tempStatus, tempHeaders, tempConfig) {
        console.log(tempDataAPI, tempStatus, tempHeaders, tempConfig);
      });


    $http.get(cfg.apiUrl + "/measurements/?patient_id=" + patientId + "&type=A")
      .success(function (activityDataAPI) {
        $scope.chartActivityConfig.series[0].data = activityDataAPI.results;
      })
      .error(function (activityDataAPI, activityStatus, activityHeaders, activityConfig) {
        console.log(activityDataAPI, activityStatus, activityHeaders, activityConfig);
      });
  });

  $scope.updateChartRange = function () {
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

  function setPlotBands(config, min, max) {
    var plotBands = [];
    plotBands.push({
      color: 'rgba(245,127,127,0.2)', // red, low
      from: '0',
      to: min
    });

    if (max) {
      var tmpMax = max;
    } else {
      var tmpMax = 1000;
    }
    plotBands.push({
      color: 'rgba(125,235,121,0.2)', // green
      from: min,
      to: tmpMax
    });

    if (max) {
      plotBands.push({
        color: 'rgba(245,127,127,0.2)', // red, high
        from: max,
        to: 1000
      });
    }

    config.options.yAxis.plotBands = plotBands;
  }
});
