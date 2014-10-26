angelikaControllers.controller('PatientInfoCtrl', function($scope, $modal) {

  $scope.getPatient().then(function(patient) {
    $scope.patient = patient;
  });

  //TODO: get this from the API
  $scope.alarms = [
    {
      time_created: "2014-10-10T06:08:51Z",
      is_treated: false,
      treated_text: "",
      value: 87,
      type: 'O'
    },
    {
      time_created: "2014-10-01T01:49:34Z",
      is_treated: true,
      type: 'P',
      value: 110,
      treated_text: "Hjerteflimmer."
    },
    {
      time_created: "2014-09-22T22:04:07Z",
      is_treated: true,
      type: 'T',
      value: 38.4,
      treated_text: "Feber."
    },
    {
      time_created: "2014-09-03T10:28:07Z",
      is_treated: true,
      type: 'P',
      value: 98,
      treated_text: "Fall i trapp."
    }
  ];

  $scope.open = function(size, idx) {
    $modal.open({
      templateUrl: 'handleAlertModalContent.html',
      controller: 'handleAlertModalInstanceCtrl',
      size: size,
      resolve: {
        alarm: function() {
          return $scope.alarms[idx];
        }
      }
    });
  };
});

angelikaControllers.controller('handleAlertModalInstanceCtrl', function ($scope, $modalInstance, alarm) {

  $scope.alarm = alarm;

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.getAlertType = function(typeChar) {
    //TODO: compare value to normal value
    var highOrLow = "lav ";
    var type;
    switch (typeChar) {
      case "O":
        type = "o2-metning";
        break;
      case "P":
        type = "puls";
        break;
      case "T":
        type = "temperatur";
        break;
    }
    return "Unormalt " + highOrLow + type;
  }

  $scope.getNormalValue = function(type, time) {
    //TODO: get old normal value

    return "89% - 100%";
  }
});
