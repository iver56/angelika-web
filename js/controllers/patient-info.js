angelikaControllers.controller('PatientInfoCtrl', function($scope) {
  $scope.patient = {
    name: "Lars Overhaug",
    national_identification_number: "07043298765",
    telephone: 97526925,
    address: "Storgata 10",
    age: 82,
    next_of_kin: [
      {
        name: "Nils Overhaug",
        telephone: 73345544,
        address:"Lillegata 20"
      },
      {
        name: "Lise Overhaug",
        telephone: 92452343,
        address: "Bittelillegata 30"
      }
    ],
    alarms: [
      {
        time_created: "2014-10-10T06:08:51Z",
        is_treated: false,
        treated_text: ""
      },
      {
        time_created: "2014-10-01T01:49:34Z",
        is_treated: true,
        treated_text: "Hjerteflimmer."
      },
      {
        time_created: "2014-09-22T22:04:07Z",
        is_treated: true,
        treated_text: "Feber."
      },
      {
        time_created: "2014-09-03T10:28:07Z",
        is_treated: true,
        treated_text: "Fall i trapp."
      }
    ],
    motivational_note: "Go hard or go home!",
    information_note: "Du er ganske ille tilredt, snakk med dine nærmeste og få sakene dine i orden. Vell blåst!"
  };
});
