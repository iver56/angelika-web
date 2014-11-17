angelikaControllers.controller('PatientGraphsCtrl', function($scope, $http, cfg, $element, $modal, $timeout, ChartHelper) {
  $scope.chartRange = {days: 7};
  $scope.container = $($element).closest('.lm_content');

  function setChartDimensions() {
    $scope.chartO2Config.size.width = $scope.graphWidth;
    $scope.chartO2Config.size.height = $scope.graphHeight;
    $scope.chartHeartRateConfig.size.width = $scope.graphWidth;
    $scope.chartHeartRateConfig.size.height = $scope.graphHeight;
    $scope.chartTempConfig.size.width = $scope.graphWidth;
    $scope.chartTempConfig.size.height = $scope.graphHeight;
    $scope.chartActivityConfig.size.width = $scope.graphWidth;
    $scope.chartActivityConfig.size.height = $scope.graphHeight;
  }

  $scope.getPatient().then(function(patient) {
    $scope.patient = patient;
  });

  $scope.tabSelected = function() {
    $scope.graphWidth = ChartHelper.getGraphWidth($scope.container.width());
    $scope.graphHeight = ChartHelper.getGraphHeight($scope.container.height());
    setChartDimensions();
  };

  $scope.getPatientId().then(function(patientId) {
    dashboardLayout.on('resizePatient' + patientId, function(width, height) {
      $scope.graphWidth = ChartHelper.getGraphWidth(width);
      $scope.graphHeight = ChartHelper.getGraphHeight(height);
      setChartDimensions();
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });
  });

  var commonChartConfig = {
    options: {
      chart: {
        type: 'spline',
        zoomType: 'x'
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
        pointFormat: '{series.name}: <b>{point.y}</b>',
        xDateFormat: '%A %d.%m.%Y kl. %H:%M'
      }
    },
    size: {
      width: null,
      height: 350
    },
    series: [
      {
        "name": "Målt verdi"
      },
      {
        name: 'Unormalt lavt område',
        type: 'arearange',
        color: '#F57F7F', // red
        fillOpacity: 0.3,
        data: [],
        zIndex: -1,
        lineWidth: 0,
        enableMouseTracking: false
      },
      {
        name: 'OK område',
        type: 'arearange',
        color: '#73BF71', // green
        fillOpacity: 0.3,
        data: [],
        zIndex: -2,
        lineWidth: 0,
        enableMouseTracking: false
      },
      {
        name: 'Unormalt lavt område',
        type: 'arearange',
        color: '#F57F7F', // red
        fillOpacity: 0.3,
        data: [],
        zIndex: -1,
        lineWidth: 0,
        enableMouseTracking: false
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

  // Set chart titles
  $scope.chartO2Config.options.title.text = "O₂-metning";
  $scope.chartHeartRateConfig.options.title.text = "Puls";
  $scope.chartTempConfig.options.title.text = "Temperatur";
  $scope.chartActivityConfig.options.title.text = "Fysisk aktivitet";

  // Set tooltip suffixes
  $scope.chartO2Config.options.tooltip.valueSuffix = " %";
  $scope.chartHeartRateConfig.options.tooltip.valueSuffix = " slag/min";
  $scope.chartTempConfig.options.tooltip.valueSuffix = " °C";
  $scope.chartActivityConfig.options.tooltip.valueSuffix = " skritt/dag";

  // Y-axis titles
  $scope.chartO2Config.options.yAxis.title.text = "O₂-metning (prosent)";
  $scope.chartHeartRateConfig.options.yAxis.title.text = "Puls (slag pr. minutt)";
  $scope.chartTempConfig.options.yAxis.title.text = "Temperatur (°C)";
  $scope.chartActivityConfig.options.yAxis.title.text = "Antall skritt per dag";

  // Y-axis max
  $scope.chartO2Config.options.yAxis.max = 100;

  $scope.handleAlarm = function(alarm) {
    $http.get(cfg.apiUrl + "/alarms/" + alarm.id + "/")
      .success(function(alarm) {
        $scope.openAlarmModal(alarm);
      })
      .error(function(data) {
        alert('Kunne ikke laste informasjon om varselet');
      });
  };

  function getConfigByAlarm(alarm) {
    var type = alarm.measurement.type;
    var config = null;
    if ('O' === type) {
      config = $scope.chartO2Config;
    } else if ('P' === type) {
      config = $scope.chartHeartRateConfig;
    } else if ('T' === type) {
      config = $scope.chartTempConfig;
    }
    return config;
  }

  function getDataPointByAlarm(alarm, config) {
    for (var i = config.series[0].data.length - 1; i >= 0; i--) {
      if (config.series[0].data[i].alarm && config.series[0].data[i].alarm.id === alarm.id) {
        return config.series[0].data[i];
      }
    }
    return null;
  }

  $scope.disableIcon = function(alarm) {
    var config = getConfigByAlarm(alarm);
    if (null === config) {
      return;
    }
    var point = getDataPointByAlarm(alarm, config);

    if (point && point.marker) {
      point.marker.symbol = null;
      delete point.events;
      $scope.redrawChart(config);
    }
  };

  $scope.redrawChart = function(config) {
    var tempData = config.series[0].data;
    config.series[0].data = [
      {x: 0, y: 0}
    ];
    if (!$scope.$$phase) {
      $scope.$apply();
    }
    $timeout(function() {
      config.series[0].data = tempData;
    }, 0);
  };

  dashboardLayout.on('handledAlarm', function(alarm) {
    if (alarm.is_treated) {
      $scope.disableIcon(alarm);
    }
  });

  $scope.openAlarmModal = function(alarm) {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/handle-alarm.html',
      controller: 'HandleAlarmCtrl',
      size: null,
      resolve: {
        alarm: function() {
          return angular.copy(alarm);
        },
        editMode: function() {
          return alarm.is_treated ? true : false
        },
        patient: function() {
          return $scope.patient
        }
      }
    });
    modalInstance.result.then(function(data) {
      if (data.alarm.is_treated) {
        $scope.disableIcon(data.alarm);
      }
      if (data.motivation_text.id) {
        $scope.patient.motivation_texts.push(data.motivation_text);
      }
    });
  };

  var showO2Data = function(o2DataAPI) {
    var o2Data = o2DataAPI.measurements;
    for (var i = 0; i < o2Data.length; i++) {
      ChartHelper.setPointAppearance(o2Data[i], $scope.handleAlarm);
    }
    $scope.chartO2Config.series[0].data = o2Data;
    ChartHelper.addBackgroundColors($scope.chartO2Config, o2DataAPI.lower_threshold_values, o2DataAPI.upper_threshold_values, 0, 100);
    var roof = 100; // O2 never goes above 100%
    ChartHelper.checkYAxisRange($scope.chartO2Config, o2DataAPI.lower_threshold_values, o2DataAPI.upper_threshold_values, roof);
  };

  function showHeartRateData(heartRateDataAPI) {
    var heartRateData = heartRateDataAPI.measurements;
    for (var i = 0; i < heartRateData.length; i++) {
      ChartHelper.setPointAppearance(heartRateData[i], $scope.handleAlarm);
    }
    $scope.chartHeartRateConfig.series[0].data = heartRateData;
    ChartHelper.addBackgroundColors($scope.chartHeartRateConfig, heartRateDataAPI.lower_threshold_values, heartRateDataAPI.upper_threshold_values, 0, 300);
    var roof = 200; // heart rate above 200 is unlikely for our users
    ChartHelper.checkYAxisRange($scope.chartHeartRateConfig, heartRateDataAPI.lower_threshold_values, heartRateDataAPI.upper_threshold_values, roof);
  }

  function showTemperatureData(temperatureDataAPI) {
    var temperatureData = temperatureDataAPI.measurements;
    for (var i = 0; i < temperatureData.length; i++) {
      ChartHelper.setPointAppearance(temperatureData[i], $scope.handleAlarm);
    }
    $scope.chartTempConfig.series[0].data = temperatureData;
    ChartHelper.addBackgroundColors($scope.chartTempConfig, temperatureDataAPI.lower_threshold_values, temperatureDataAPI.upper_threshold_values, 0, 100);
    var roof = 100; //temperature above 100 degrees celsius isn't a valid scenario in this system
    ChartHelper.checkYAxisRange($scope.chartTempConfig, temperatureDataAPI.lower_threshold_values, temperatureDataAPI.upper_threshold_values, roof);
  }

  function showActivityData(activityDataAPI) {
    $scope.chartActivityConfig.series[0].data = activityDataAPI.measurements;
  }

  $scope.o2DataListeners.push(showO2Data);
  $scope.heartRateDataListeners.push(showHeartRateData);
  $scope.temperatureDataListeners.push(showTemperatureData);
  $scope.activityDataListeners.push(showActivityData);

  $scope.getPatient().then(function(patient) {
    $scope.getPatientO2Data().then(showO2Data);
    $scope.getPatientHeartRateData().then(showHeartRateData);
    $scope.getPatientTemperatureData().then(showTemperatureData);
    $scope.getPatientActivityData().then(showActivityData);
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
