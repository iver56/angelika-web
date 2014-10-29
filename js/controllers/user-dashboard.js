angelikaControllers.controller('UserDashboardCtrl', function ($scope, $http, cfg, AuthService) {
  $http.get(cfg.apiUrl + "/current-patient/")
    .success(function (patientData) {
      $scope.patient = patientData;
      $scope.motivationalMsg = "Motiverende melding skrevet av helsepersonell kommer her.";
      $scope.otherMsg = "Annen informasjon skrevet av helsepersonell kommer her.";

      var now = new Date().getTime();
      var msPerDay = 86400000;
      var min = now - (msPerDay * 7); // 7 days ago

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
          title: {
            text: ''
          },
          xAxis: {
            type: 'datetime',
            minTickInterval: 24 * 3600 * 1000,
            min: min,
            max: now,
            labels: {
              style: {
                fontSize: '18px'
              }
            }
          },
          yAxis: {
            title: {
              style: {
                fontSize: '18px'
              }
            },
            labels: {
              style: {
                fontSize: '18px'
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

      $scope.setChartWidths = function () {
        var width = $("#charts").width();
        $scope.chartO2Config.options.chart.width = width;
        $scope.chartHeartRateConfig.options.chart.width = width;
        $scope.chartTempConfig.options.chart.width = width;
        $scope.chartActivityConfig.options.chart.width = width;
      };

      if ($scope.patient.o2_access) {
        $http.get(cfg.apiUrl + "/current-patient/measurements/?type=O")
          .success(function (o2Data) {
            $scope.chartO2Config.series[0].data = o2Data;
            setPlotBands($scope.chartO2Config, $scope.patient.o2_min, null);
            checkYAxisRange($scope.chartO2Config, $scope.patient.o2_min, null);
          })
          .error(function (o2DataAPI, o2Status, o2Headers, o2Config) {
            console.log(o2DataAPI, o2Status, o2Headers, o2Config);
          });
      }

      if ($scope.patient.pulse_access) {
        $http.get(cfg.apiUrl + "/current-patient/measurements/?type=P")
          .success(function (heartRateData) {
            $scope.chartHeartRateConfig.series[0].data = heartRateData;
            setPlotBands($scope.chartHeartRateConfig, $scope.patient.pulse_min, $scope.patient.pulse_max);
            checkYAxisRange($scope.chartHeartRateConfig, $scope.patient.pulse_min, $scope.patient.pulse_max);
          })
          .error(function (heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig) {
            console.log(heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig);
          });
      }

      if ($scope.patient.temperature_access) {
        $http.get(cfg.apiUrl + "/current-patient/measurements/?type=T")
          .success(function (temperatureData) {
            $scope.chartTempConfig.series[0].data = temperatureData;
            setPlotBands($scope.chartTempConfig, $scope.patient.temperature_min, $scope.patient.temperature_max);
            checkYAxisRange($scope.chartTempConfig, $scope.patient.temperature_min, $scope.patient.temperature_max);
          })
          .error(function (tempDataAPI, tempStatus, tempHeaders, tempConfig) {
            console.log(tempDataAPI, tempStatus, tempHeaders, tempConfig);
          });
      }

      if ($scope.patient.activity_access) {
        $http.get(cfg.apiUrl + "/current-patient/measurements/?type=A")
          .success(function (activityData) {
            $scope.chartActivityConfig.series[0].data = activityData;
          })
          .error(function (activityDataAPI, activityStatus, activityHeaders, activityConfig) {
            console.log(activityDataAPI, activityStatus, activityHeaders, activityConfig);
          });
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data, status, headers, config);
    });

  $scope.logOut = function () {
    AuthService.logOut();
    window.location.href = 'index.html';
  };

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

  function checkYAxisRange(config, min, max) {
    var aboveMax = false;
    var belowMin = false;
    for (var i=0; i<config.series[0].data.length; i++) {
      if (max) {
        if (config.series[0].data[i].y > max) {
          aboveMax = true;
        }
      }
      if (config.series[0].data[i].y < min) {
        belowMin = true;
      }
    }

    var yAxisInterval;
    if (max) {
      yAxisInterval = (max - min) / 10;
    } else {
      yAxisInterval = (100 - min) / 10;
    }

    if (max && !aboveMax) {
      config.options.yAxis.max = (max + yAxisInterval);
    }
    if (!belowMin) {
      config.options.yAxis.min = (min - yAxisInterval);
    }
  }
});
