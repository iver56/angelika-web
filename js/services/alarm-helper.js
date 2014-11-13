angelikaServices.service('AlarmHelper', function() {
  this.measurementType = {
    A: 'aktivitet',
    C: 'Ring meg',
    O: 'O₂-metning',
    P: 'puls',
    T: 'temperatur'
  };
  this.measurementTypeUnit = {
    A: 'skritt per dag',
    O: '%',
    P: 'slag per minutt',
    T: '°C'
  };
  this.alarmReason = {
    null: '',
    false: 'Lav',
    true: 'Høy'
  }
});
