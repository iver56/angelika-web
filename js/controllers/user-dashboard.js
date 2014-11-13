angelikaControllers.controller('UserDashboardCtrl', function($scope, $http, cfg, AuthService) {
  $http.get(cfg.apiUrl + "/current-patient/")
    .success(function(patientData) {
      $scope.patient = patientData;
      $scope.callRequest = {
        registered: false
      };

      var now = new Date().getTime();
      var msPerDay = 86400000;
      var min = now - (msPerDay * 7); // 7 days ago

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
          }
        },
        series: [
          {
            "name": "Målt verdi"
          }
        ]
      };

      // Set common config for all charts
      $scope.chartO2Config = angular.copy(commonChartConfig);
      $scope.chartHeartRateConfig = angular.copy(commonChartConfig);
      $scope.chartTempConfig = angular.copy(commonChartConfig);
      $scope.chartActivityConfig = angular.copy(commonChartConfig);

      $scope.chartActivityConfig.options.chart.type = 'column';
      $scope.chartActivityConfig.options.tooltip.xDateFormat = '%A %d.%m.%Y';

      // Set tooltip suffixes
      $scope.chartO2Config.options.tooltip.valueSuffix = " %";
      $scope.chartHeartRateConfig.options.tooltip.valueSuffix = " slag/min";
      $scope.chartTempConfig.options.tooltip.valueSuffix = " °C";
      $scope.chartActivityConfig.options.tooltip.valueSuffix = " skritt/dag";

      // Y-axis titles
      $scope.chartO2Config.options.yAxis.title.text = "O₂-metning (prosent)";
      $scope.chartHeartRateConfig.options.yAxis.title.text = "Puls (slag pr. minutt)";
      $scope.chartTempConfig.options.yAxis.title.text = "Temperatur (°C)";
      $scope.chartActivityConfig.options.yAxis.title.text = "Aktivitet (Skritt per dag)";

      // Y-axis max
      $scope.chartO2Config.options.yAxis.max = 100;

      $scope.setChartWidths = function() {
        var width = $("#charts").width();
        $scope.chartO2Config.options.chart.width = width;
        $scope.chartHeartRateConfig.options.chart.width = width;
        $scope.chartTempConfig.options.chart.width = width;
        $scope.chartActivityConfig.options.chart.width = width;
      };

      if ($scope.patient.o2_access) {
        $http.get(cfg.apiUrl + "/current-patient/graph_data/?type=O")
          .success(function(o2Data) {
            $scope.chartO2Config.series[0].data = o2Data.measurements;
          })
          .error(function(o2DataAPI, o2Status, o2Headers, o2Config) {
            console.error(o2DataAPI, o2Status, o2Headers, o2Config);
          });
      }

      if ($scope.patient.pulse_access) {
        $http.get(cfg.apiUrl + "/current-patient/graph_data/?type=P")
          .success(function(heartRateData) {
            $scope.chartHeartRateConfig.series[0].data = heartRateData.measurements;
          })
          .error(function(heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig) {
            console.error(heartRateDataAPI, heartRateStatus, heartRateHeaders, heartRateConfig);
          });
      }

      if ($scope.patient.temperature_access) {
        $http.get(cfg.apiUrl + "/current-patient/graph_data/?type=T")
          .success(function(temperatureData) {
            $scope.chartTempConfig.series[0].data = temperatureData.measurements;
          })
          .error(function(tempDataAPI, tempStatus, tempHeaders, tempConfig) {
            console.error(tempDataAPI, tempStatus, tempHeaders, tempConfig);
          });
      }

      if ($scope.patient.activity_access) {
        $http.get(cfg.apiUrl + "/current-patient/graph_data/?type=A")
          .success(function(activityData) {
            $scope.chartActivityConfig.series[0].data = activityData.measurements;
          })
          .error(function(activityDataAPI, activityStatus, activityHeaders, activityConfig) {
            console.error(activityDataAPI, activityStatus, activityHeaders, activityConfig);
          });
      }
    })
    .error(function(data, status, headers, config) {
      console.error(data, status, headers, config);
    });

  $scope.logOut = function() {
    AuthService.logOut();
    window.location.href = 'index.html';
  };

  $scope.registerCallRequest = function() {
    var url = cfg.apiUrl + "/current-patient/call_me/";
    $http['post'](url)
      .success(function(result) {
        $scope.callRequest.registered = true;
      })
      .error(function(data) {
        console.error("Call request error", data);
        alert("Noe gikk galt. Oppringnings-forespørsel ble ikke registrert.");
      });
  }

});
