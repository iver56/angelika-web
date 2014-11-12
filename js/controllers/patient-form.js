angelikaControllers.controller('PatientFormCtrl', function($scope, $http, cfg, LayoutUtils, $modal) {
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
  $scope.patientBeforeChanges = {
    o2_min: null,
    o2_max: null,
    pulse_min: null,
    pulse_max: null,
    temperature_min: null,
    temperature_max: null
  };

  // getPatient is inherited from the parent scope (PatientCtrl). Available only if the patient already exists.
  if ($scope.getPatient) {
    $scope.getPatient().then(function(patient) {
      $scope.patient = patient;
      $scope.patientBeforeChanges = angular.copy(patient);
    });
  }

  function getChangedThresholdValues() {
    var o2MinChanged = $scope.patientBeforeChanges.o2_min !== $scope.patient.o2_min;
    var o2MaxChanged = $scope.patientBeforeChanges.o2_max !== $scope.patient.o2_max;
    var pulseMinChanged = $scope.patientBeforeChanges.pulse_min !== $scope.patient.pulse_min;
    var pulseMaxChanged = $scope.patientBeforeChanges.pulse_max !== $scope.patient.pulse_max;
    var temperatureMinChanged = $scope.patientBeforeChanges.temperature_min !== $scope.patient.temperature_min;
    var temperatureMaxChanged = $scope.patientBeforeChanges.temperature_max !== $scope.patient.temperature_max;

    if (o2MinChanged || o2MaxChanged || pulseMinChanged || pulseMaxChanged || temperatureMinChanged
      || temperatureMaxChanged) {
      return {
        o2MinChanged: o2MinChanged,
        o2MaxChanged: o2MaxChanged,
        pulseMinChanged: pulseMinChanged,
        pulseMaxChanged: pulseMaxChanged,
        temperatureMinChanged: temperatureMinChanged,
        temperatureMaxChanged: temperatureMaxChanged
      };
    } else {
      return false;
    }
  }

  function openConfirmModal(changedThresholdValues) {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/confirm-threshold-values.html',
      controller: 'ConfirmThresholdValuesCtrl',
      size: null,
      resolve: {
        changedThresholdValues: function() {
          return changedThresholdValues;
        },
        patientBeforeChanges: function() {
          return $scope.patientBeforeChanges;
        },
        patient: function() {
          return $scope.patient;
        }
      }
    });
    modalInstance.result.then(function() {
      $scope.patientBeforeChanges = angular.copy($scope.patient);
      $scope.save();
    });
  };

  $scope.save = function() {
    var changedThresholdValues = getChangedThresholdValues();
    if (changedThresholdValues) {
      openConfirmModal(changedThresholdValues);
      return;
    }

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
        $scope.addSuccessAlert();
        $scope.posting = false;
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
