angelikaServices.service('DateTimeHelper', function() {
  this.timestampToDate = function(timestamp) {
    return new Date(timestamp);
  };
});
