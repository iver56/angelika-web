angelikaControllers.controller('PatientFormCtrl', function($scope, $http, cfg) {
  $scope.posting = false;
  $scope.getPatient().then(function(patient) {
    $scope.patient = patient;
  });

  $scope.save = function() {
    $scope.posting = true;
    $http.patch(cfg.apiUrl + "/patients/" + $scope.patientId + "/", $scope.patient)
      .success(function(patient) {
        for (var property in patient) {
          if (patient.hasOwnProperty(property) && $scope.patient.hasOwnProperty(property)) {
            $scope.patient[property] = patient[property];
          }
        }

        var fullName = patient.user.first_name + " " + patient.user.last_name;
        var $tab = $(".lm_tab[data-patient-id='" + $scope.patient.id + "']");
        $tab.attr('title', fullName);
        $tab.find('span.lm_title').text(fullName);
        $scope.posting = false;
      })
      .error(function(data) {
        $scope.posting = false;
        console.error(data);
      });
  };

  $scope.addNextOfKin = function() {
    $scope.patient.next_of_kin.push({
      id: null,
      full_name: '',
      address: '',
      phone_number: '',
      priority: $scope.patient.next_of_kin[$scope.patient.next_of_kin.length - 1].priority + 1,
      relation: ''
    });
  };

  $scope.removeNextOfKin = function(index) {
    $scope.patient.next_of_kin.splice(index, 1);
  };

  $scope.moveNextOfKinUp = function(index) {
    var temp = $scope.patient.next_of_kin[index];
    $scope.patient.next_of_kin[index] = $scope.patient.next_of_kin[index - 1];
    $scope.patient.next_of_kin[index - 1] = temp;
  }

  $scope.moveNextOfKinDown = function(index) {
    var temp = $scope.patient.next_of_kin[index];
    $scope.patient.next_of_kin[index] = $scope.patient.next_of_kin[index + 1];
    $scope.patient.next_of_kin[index + 1] = temp;
  }
});
