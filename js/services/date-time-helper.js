angelikaServices.service('DateTimeHelper', function() {
  this.millisToUTCDate = function(millis) {
    var date = new Date(millis);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  };
});
