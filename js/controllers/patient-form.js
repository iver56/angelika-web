angelikaControllers.controller('PatientFormCtrl', function($scope, $http, cfg) {
  $scope.getPatient().then(function(patient) {
    $scope.patient = patient;
  });

  $scope.save = function() {
    $http.patch(cfg.apiUrl + "/patients/" + $scope.patientId + "/", $scope.patient)
      .success(function(patient) {
        var fullName = patient.user.first_name + " " + patient.user.last_name;
        var $tab = $(".lm_tab[data-patient-id='" + $scope.patientId + "']");
        $tab.attr('title', fullName);
        $tab.find('span.lm_title').text(fullName);
      })
      .error(function(data) {
        console.error(data);
      });
  };

});
