angelikaControllers.controller('PatientGraphsCtrl', function($scope, $http, cfg) {
  $scope.chartRange = {days: 7};

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
      }
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

  var alertIconUrl = 'url(../../img/alert-icon.png)';

  $scope.setChartWidths = function() {
    var width = $("#charts").width();
    $scope.chartO2Config.options.chart.width = width;
    $scope.chartHeartRateConfig.options.chart.width = width;
    $scope.chartTempConfig.options.chart.width = width;
    $scope.chartActivityConfig.options.chart.width = width;
  };

  $scope.getPatient().then(function(patient) {
    $scope.getPatientO2Data().then(function(o2DataAPI) {
      var o2Data = o2DataAPI.measurements;

      for (var i = 0; i < o2Data.length; i++) {
        if (false/*o2Data[i].alert*/) {
          o2Data[i].events = {
            click: function(e) {
              console.log(e);
              alert('test');
            }
          };
          o2Data[i].marker = {
            symbol: alertIconUrl
          };
        }
      }
      $scope.chartO2Config.series[0].data = o2Data;

      addBackgroundColors($scope.chartO2Config, o2DataAPI.lower_threshold_values, o2DataAPI.upper_threshold_values, 0, 100);
      checkYAxisRange($scope.chartO2Config, o2DataAPI.lower_threshold_values, o2DataAPI.upper_threshold_values);
    });

    $scope.getPatientHeartRateData().then(function(heartRateDataAPI) {
      var heartRateData = heartRateDataAPI.measurements;

      for (var i = 0; i < heartRateData.length; i++) {
        if (false/*heartRateData[i].alert*/) {
          heartRateData[i].events = {
            click: function(e) {
              console.log(e);
              alert('test');
            }
          };
          heartRateData[i].marker = {
            symbol: alertIconUrl
          };
        }
      }
      $scope.chartHeartRateConfig.series[0].data = heartRateData;

      addBackgroundColors($scope.chartHeartRateConfig, heartRateDataAPI.lower_threshold_values, heartRateDataAPI.upper_threshold_values, 0, 200);
      checkYAxisRange($scope.chartHeartRateConfig, heartRateDataAPI.lower_threshold_values, heartRateDataAPI.upper_threshold_values);
    });

    $scope.getPatientTemperatureData().then(function(temperatureDataAPI) {
      var temperatureData = temperatureDataAPI.measurements;

      for (var i = 0; i < temperatureData.length; i++) {
        if (false/*temperatureData[i].alert*/) {
          temperatureData[i].events = {
            click: function(e) {
              console.log(e);
              alert('test');
            }
          };
          temperatureData[i].marker = {
            symbol: alertIconUrl
          };
        }
      }

      $scope.chartTempConfig.series[0].data = temperatureData;
      addBackgroundColors($scope.chartTempConfig, temperatureDataAPI.lower_threshold_values, temperatureDataAPI.upper_threshold_values, 0, 100);
      checkYAxisRange($scope.chartTempConfig, temperatureDataAPI.lower_threshold_values, temperatureDataAPI.upper_threshold_values);
    });

    $scope.getPatientActivityData().then(function(activityDataAPI) {
      $scope.chartActivityConfig.series[0].data = activityDataAPI.measurements;
    });
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

      config.series.push({
        name: 'Unormalt høyt område',
        type: 'arearange',
        color: '#F57F7F', // red
        fillOpacity: 0.3,
        data: highArea,
        zIndex: -1,
        lineWidth: 0,
        enableMouseTracking: false
      });
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
    for (var i=0; i<allValues.length; i++) {
      okArea.push([
        allValues[i].x, allValues[i].min, allValues[i].max
      ]);

      if (i+1 == allValues.length) {
        okArea.push([
          Date.now(), allValues[i].min, allValues[i].max
        ]);
      } else {
        okArea.push([
          allValues[i+1].x - 1, allValues[i].min, allValues[i].max
        ]);
      }
    }

    config.series.push({
      name: 'OK område',
      type: 'arearange',
      color: '#73BF71', // green
      fillOpacity: 0.3,
      data: okArea,
      zIndex: -2,
      lineWidth: 0,
      enableMouseTracking: false
    });

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

    config.series.push({
      name: 'Unormalt lavt område',
      type: 'arearange',
      color: '#F57F7F', // red
      fillOpacity: 0.3,
      data: lowArea,
      zIndex: -1,
      lineWidth: 0,
      enableMouseTracking: false
    });
  }

  function checkYAxisRange(config, lower_threshold_values, upper_threshold_values) {
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

    if (aboveMax) {
      config.options.yAxis.max = (extremeValues.highest + yAxisInterval);
    } else {
      config.options.yAxis.max = (max + yAxisInterval);
    }

    if (belowMin) {
      config.options.yAxis.min = (extremeValues.lowest - yAxisInterval);
    } else {
      config.options.yAxis.min = (min - yAxisInterval);
    }
  }


  function getExtremeValues(data) {
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
    var lowest = 999999;
    for (var i=0; i<values.length; i++) {
      if (values[i].y < lowest) {
        lowest = values[i].y;
      }
    }
    return lowest;
  }

  function getHighestValue(values) {
    var highest = 0;
    for (var i=0; i<values.length; i++) {
      if (values[i].y > highest) {
        highest = values[i].y;
      }
    }
    return highest;
  }
});
