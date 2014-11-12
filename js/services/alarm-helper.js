angelikaServices.service('AlarmHelper', function() {
  this.measurementType = {
    A: 'Aktivitet',
    C: 'Ring meg',
    O: 'O2-metning',
    P: 'Puls',
    T: 'Temperatur'
  };
  this.lowerCaseMeasurementType = {
    A: 'aktivitet',
    C: 'ring meg',
    O: 'O2-metning',
    P: 'puls',
    T: 'temperatur'
  };
  this.measurementTypeUnit = {
    A: 'skritt per dag',
    O: '%',
    P: 'slag per minutt',
    T: '°C'
  };
});
