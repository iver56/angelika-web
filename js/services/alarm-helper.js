angelikaServices.service('AlarmHelper', function() {
  this.measurementType = {
    A: 'aktivitet',
    C: 'Ring meg',
    O: 'O₂-metning',
    P: 'puls',
    T: 'temperatur'
  };
  this.measurementTypeUnit = {
    A: 'skritt/dag',
    O: '%',
    P: 'slag/min',
    T: '°C'
  };
  this.alarmReason = {
    null: '',
    false: 'Lav',
    true: 'Høy'
  }
});
