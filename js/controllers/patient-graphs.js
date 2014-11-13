angelikaControllers.controller('PatientGraphsCtrl', function($scope, $http, cfg, $element, $modal, $timeout) {
  $scope.chartRange = {days: 7};

  function getGraphWidth(containerWidth) {
    return containerWidth - 40;
  }

  function getGraphHeight(containerHeight) {
    return Math.min(Math.max(250, Math.floor(containerHeight * 0.45)), 400);
  }

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
    $scope.graphWidth = getGraphWidth($scope.container.width());
    $scope.graphHeight = getGraphHeight($scope.container.height());
    setChartDimensions();
  };

  $scope.getPatientId().then(function(patientId) {
    dashboardLayout.on('resizePatient' + patientId, function(width, height) {
      $scope.graphWidth = getGraphWidth(width);
      $scope.graphHeight = getGraphHeight(height);
      setChartDimensions();
      $scope.$apply();
    });
  });

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

  var alertIconUrl = 'url(../../img/alert-icon.png)';

  $scope.handleAlarm = function(alarm) {
    $http.get(cfg.apiUrl + "/alarms/" + alarm.id + "/")
      .success(function(data) {
        alarm = data;
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

    if (point) {
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
    if(!$scope.$$phase) {
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
      $scope.chartO2Config.series[0] = angular.copy($scope.chartO2Config.series[0]);
    });
  };

  function setPointAppearance(point) {
    if (point.alarm) {
      point.color = '#BF0B23';
      if (!point.alarm.is_treated) {
        point.events = {
          click: function(e) {
            $scope.handleAlarm(e.currentTarget.alarm);
          }
        };
        point.marker = {
          symbol: alertIconUrl
        };
      }
    }
  }

  var showO2Data = function(o2DataAPI) {
    var o2Data = o2DataAPI.measurements;
    for (var i = 0; i < o2Data.length; i++) {
      setPointAppearance(o2Data[i]);
    }
    $scope.chartO2Config.series[0].data = o2Data;
    addBackgroundColors($scope.chartO2Config, o2DataAPI.lower_threshold_values, o2DataAPI.upper_threshold_values, 0, 100);
    var roof = 100; // O2 never goes above 100%
    checkYAxisRange($scope.chartO2Config, o2DataAPI.lower_threshold_values, o2DataAPI.upper_threshold_values, roof);
  };

  function showHeartRateData(heartRateDataAPI) {
    var heartRateData = heartRateDataAPI.measurements;
    for (var i = 0; i < heartRateData.length; i++) {
      setPointAppearance(heartRateData[i]);
    }
    $scope.chartHeartRateConfig.series[0].data = heartRateData;
    addBackgroundColors($scope.chartHeartRateConfig, heartRateDataAPI.lower_threshold_values, heartRateDataAPI.upper_threshold_values, 0, 1000);
    checkYAxisRange($scope.chartHeartRateConfig, heartRateDataAPI.lower_threshold_values, heartRateDataAPI.upper_threshold_values);
  }

  function showTemperatureData(temperatureDataAPI) {
    var temperatureData = temperatureDataAPI.measurements;
    for (var i = 0; i < temperatureData.length; i++) {
      setPointAppearance(temperatureData[i]);
    }
    $scope.chartTempConfig.series[0].data = temperatureData;
    addBackgroundColors($scope.chartTempConfig, temperatureDataAPI.lower_threshold_values, temperatureDataAPI.upper_threshold_values, 0, 100);
    checkYAxisRange($scope.chartTempConfig, temperatureDataAPI.lower_threshold_values, temperatureDataAPI.upper_threshold_values);
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

  function addBackgroundColors(config, minValues, maxValues, floor, roof) {
    if (!minValues.length || !maxValues.length) {
      return;
    }

    // High, red area
    if (maxValues) {
      var highArea = [];
      for (var i = 0; i < maxValues.length; i++) {
        highArea.push([
          maxValues[i].x, maxValues[i].y, roof
        ]);

        if (i + 1 == maxValues.length) {
          highArea.push([
            Date.now(), maxValues[i].y, roof
          ]);
        } else {
          highArea.push([
              maxValues[i + 1].x - 1, maxValues[i].y, roof
          ]);
        }
      }

      config.series[1].data = highArea;
    }

    // OK area
    var allValues = [];
    for (var i = 0; i < minValues.length; i++) {
      allValues.push({
        x: minValues[i].x,
        min: minValues[i].y,
        max: null
      });
    }

    for (var i = 0; i < maxValues.length; i++) {
      var found = false;
      var newestMinValue = minValues[0].y;
      for (var j = 0; j < allValues.length && !found && maxValues[i].x >= allValues[j].x; j++) {
        newestMinValue = allValues[j].min;
        if (maxValues[i].x == allValues[j].x) {
          found = true;
          allValues[j].max = maxValues[i].y;
        }
      }
      if (!found) {
        allValues.push({
          x: maxValues[i].x,
          min: newestMinValue,
          max: maxValues[i].y
        });
      }
    }

    allValues.sort(compare);

    var newestMaxValue = maxValues[0].y;
    for (var i = 0; i < allValues.length; i++) {
      if (!allValues[i].max) {
        allValues[i].max = newestMaxValue;
      } else {
        newestMaxValue = allValues[i].max;
      }
    }

    var okArea = [];
    for (var i = 0; i < allValues.length; i++) {
      okArea.push([
        allValues[i].x, allValues[i].min, allValues[i].max
      ]);

      if (i + 1 == allValues.length) {
        okArea.push([
          Date.now(), allValues[i].min, allValues[i].max
        ]);
      } else {
        okArea.push([
            allValues[i + 1].x - 1, allValues[i].min, allValues[i].max
        ]);
      }
    }

    config.series[2].data = okArea;

    // Low, red area
    var lowArea = [];
    for (var i = 0; i < minValues.length; i++) {
      lowArea.push([
        minValues[i].x, floor, minValues[i].y
      ]);

      if (i + 1 == minValues.length) {
        lowArea.push([
          Date.now(), floor, minValues[i].y
        ]);
      } else {
        lowArea.push([
            minValues[i + 1].x - 1, floor, minValues[i].y
        ]);
      }
    }

    config.series[3].data = lowArea;
  }

  function checkYAxisRange(config, lower_threshold_values, upper_threshold_values, roof) {
    if (!lower_threshold_values.length || !upper_threshold_values) {
      return;
    }
    var min = getLowestValue(lower_threshold_values);
    var max = getHighestValue(upper_threshold_values);
    var aboveMax = false;
    var belowMin = false;
    var extremeValues = getExtremeValues(config.series[0].data);

    for (var i = 0; i < config.series[0].data.length; i++) {
      if (config.series[0].data[i].y > max) {
        aboveMax = true;
      }
      if (config.series[0].data[i].y < min) {
        belowMin = true;
      }
    }

    var yAxisInterval = (max - min) / 10;
    if (typeof roof !== 'undefined') {
      config.options.yAxis.max = roof;
    } else if (aboveMax) {
      config.options.yAxis.max = extremeValues.highest + yAxisInterval;
    } else {
      config.options.yAxis.max = (max + yAxisInterval);
    }

    if (belowMin) {
      config.options.yAxis.min = extremeValues.lowest - yAxisInterval;
    } else {
      config.options.yAxis.min = (min - yAxisInterval);
    }
  }


  function getExtremeValues(data) {
    if (0 === data.length) {
      return { highest: null, lowest: null };
    }
    var lowest = data[0].y;
    var highest = data[0].y;
    for (var i = 1; i < data.length; i++) {
      if (data[i].y < lowest) {
        lowest = data[i].y;
      }
      if (data[i].y > highest) {
        highest = data[i].y;
      }
    }
    return {
      highest: highest,
      lowest: lowest
    };
  }

  function compare(a, b) {
    if (a.x < b.x)
      return -1;
    if (a.x > b.x)
      return 1;
    return 0;
  }

  function getLowestValue(values) {
    var lowest = values[0].y;
    for (var i = 1; i < values.length; i++) {
      if (values[i].y < lowest) {
        lowest = values[i].y;
      }
    }
    return lowest;
  }

  function getHighestValue(values) {
    var highest = values[0].y;
    for (var i = 1; i < values.length; i++) {
      if (values[i].y > highest) {
        highest = values[i].y;
      }
    }
    return highest;
  }
});
