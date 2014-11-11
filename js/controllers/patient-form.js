angelikaControllers.controller('PatientFormCtrl', function($scope, $http, cfg, LayoutUtils) {
  $scope.posting = false;
  $scope.patient = {
    id: null,
    user: {},
    next_of_kin: [],
    o2_max: 100,
    show_activity: true,
    show_o2: true,
    show_pulse: true,
    show_temperature: true
  };

  // getPatient is inherited from the parent scope (PatientCtrl). Available only if the patient already exists.
  if ($scope.getPatient) {
    $scope.getPatient().then(function(patient) {
      $scope.patient = patient;
    });
  }

  $scope.save = function() {
    $scope.posting = true;

    var activeContentItem = dashboardLayout.getPatientParentComponent().getActiveContentItem();

    var method = $scope.patient.id ? 'patch' : 'post';
    var url = cfg.apiUrl + "/patients/";
    if (method === 'patch') {
      url += $scope.patientId + "/";
    }
    $http[method](url, $scope.patient)
      .success(function(patient) {
        for (var property in patient) {
          if (patient.hasOwnProperty(property) && $scope.patient.hasOwnProperty(property)) {
            $scope.patient[property] = patient[property];
          }
        }

        if ('patch' === method) {
          var fullName = patient.user.first_name + " " + patient.user.last_name;
          activeContentItem.setTitle(fullName);
        } else {
          // A new patient has been created
          activeContentItem.remove();
          LayoutUtils.openPatient(patient);
        }

        dashboardLayout.emit('patientsChanged');
        $scope.posting = false;
        $scope.addSuccessAlert();
      })
      .error(function(data) {
        $scope.posting = false;
        console.error(data);
        $scope.addErrorAlert();
      });
  };

  $scope.addNextOfKin = function() {
    $scope.patient.next_of_kin.push({
      id: null,
      full_name: '',
      address: '',
      phone_number: '',
      relation: ''
    });
  };

  $scope.addMotivationalText = function() {
    $scope.patient.motivation_texts.push({
      id: null,
      text: ''
    });
  };

  $scope.addInfoText = function() {
    $scope.patient.information_texts.push({
      id: null,
      text: ''
    });
  };

  $scope.removeNextOfKin = function(index) {
    $scope.patient.next_of_kin.splice(index, 1);
  };

  $scope.removeMotivationalText = function(index) {
    $scope.patient.motivation_texts.splice(index, 1);
  };

  $scope.removeInfoText = function(index) {
    $scope.patient.information_texts.splice(index, 1);
  };

  $scope.moveNextOfKinUp = function(index) {
    var temp = $scope.patient.next_of_kin[index];
    $scope.patient.next_of_kin[index] = $scope.patient.next_of_kin[index - 1];
    $scope.patient.next_of_kin[index - 1] = temp;
  };

  $scope.moveNextOfKinDown = function(index) {
    var temp = $scope.patient.next_of_kin[index];
    $scope.patient.next_of_kin[index] = $scope.patient.next_of_kin[index + 1];
    $scope.patient.next_of_kin[index + 1] = temp;
  };

  $scope.alerts = [];

  $scope.clearAlerts = function() {
    $scope.alerts = [];
  };

  $scope.addErrorAlert = function() {
    $scope.clearAlerts();
    $scope.alerts.push({ type: 'danger', msg: 'Kommunikasjon med server feilet. Ingenting ble lagret.'});
  };

  $scope.validateForm = function(valid) {
    if (!valid) {
      $scope.clearAlerts();
      $scope.alerts.push({
        type: 'danger',
        msg: 'Det er noe feil med informasjonen (se røde felter). Ingenting ble lagret.'
      });
    }
    return valid;
  };

  $scope.addSuccessAlert = function() {
    $scope.clearAlerts();
    $scope.alerts.push({ type: 'success', msg: 'Endringer er lagret.'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});
