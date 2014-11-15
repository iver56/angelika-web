angelikaServices.service('ChartHelper', function() {
  /**
   * @param config
   * @param lower_threshold_values
   * @param upper_threshold_values
   * @param roof (the max y value won't exceed this value)
   */
  this.checkYAxisRange = function(config, lower_threshold_values, upper_threshold_values, roof) {
    if (!lower_threshold_values.length || !upper_threshold_values) {
      return;
    }
    var min = this.getLowestValue(lower_threshold_values);
    var max = this.getHighestValue(upper_threshold_values);
    var aboveMax = false;
    var belowMin = false;
    var extremeValues = this.getExtremeValues(config.series[0].data);

    for (var i = 0; i < config.series[0].data.length; i++) {
      if (config.series[0].data[i].y > max) {
        aboveMax = true;
      }
      if (config.series[0].data[i].y < min) {
        belowMin = true;
      }
    }
    var yAxisInterval = (max - min) / 10;
    var determinedMax = max;
    if (aboveMax) {
      determinedMax = extremeValues.highest;
    }
    determinedMax += yAxisInterval;
    if (typeof roof !== 'undefined' && determinedMax > roof) {
      determinedMax = roof;
    }
    config.options.yAxis.max = determinedMax;

    if (belowMin) {
      config.options.yAxis.min = extremeValues.lowest - yAxisInterval;
    } else {
      config.options.yAxis.min = (min - yAxisInterval);
    }
  };

  this.getExtremeValues = function(data) {
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
  };

  this.compare = function(a, b) {
    if (a.x < b.x)
      return -1;
    if (a.x > b.x)
      return 1;
    return 0;
  };

  this.getLowestValue = function(values) {
    var lowest = values[0].y;
    for (var i = 1; i < values.length; i++) {
      if (values[i].y < lowest) {
        lowest = values[i].y;
      }
    }
    return lowest;
  };

  this.getHighestValue = function(values) {
    var highest = values[0].y;
    for (var i = 1; i < values.length; i++) {
      if (values[i].y > highest) {
        highest = values[i].y;
      }
    }
    return highest;
  };

  this.addBackgroundColors = function(config, minValues, maxValues, floor, roof) {
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

    allValues.sort(this.compare);

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
});

