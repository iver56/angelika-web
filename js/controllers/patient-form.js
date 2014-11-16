angelikaControllers.controller('PatientFormCtrl', function($scope, $http, cfg, LayoutUtils, $modal, FormHelper, SoundRecorder, $sce, $interval, $timeout) {
  $scope.posting = false;
  $scope.isNationalIdentificationNumberValid = FormHelper.isNationalIdentificationNumberValid;
  $scope.patient = {
    id: null,
    user: {},
    next_of_kin: [],
    o2_max: 100,
    show_activity: true,
    show_o2: true,
    show_pulse: true,
    show_temperature: true,
    motivation_texts: [],
    information_texts: []
  };
  $scope.patientBeforeChanges = {
    o2_min: null,
    o2_max: null,
    pulse_min: null,
    pulse_max: null,
    temperature_min: null,
    temperature_max: null
  };

  $scope.isReady = true;
  // getPatient is inherited from the parent scope (PatientCtrl). Available only if the patient already exists.
  if ($scope.getPatient) {
    $scope.isReady = false;
    $scope.getPatient().then(function(patient) {
      $scope.patient = patient;
      $scope.patientBeforeChanges = angular.copy(patient);
      $scope.isReady = true;
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

  function setProperties(source, destination) {
    for (var property in source) {
      if (source.hasOwnProperty(property) && destination.hasOwnProperty(property)) {
        destination[property] = source[property];
      }
    }
  }

  function cleanData() {
    for (var i = 0; i < $scope.patient.motivation_texts.length; i++) {
      delete $scope.patient.motivation_texts[i].isInitializing;
      delete $scope.patient.motivation_texts[i].isRecording;
      delete $scope.patient.motivation_texts[i].isConvertingToMp3;
      delete $scope.patient.motivation_texts[i].cancelRecording;
    }
  }

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
    cleanData();
    $http[method](url, $scope.patient)
      .success(function(patient) {
        dashboardLayout.emit('patientsChanged');
        if ('patch' === method) {
          setProperties(patient, $scope.patient);
          var fullName = patient.user.first_name + " " + patient.user.last_name;
          activeContentItem.setTitle('<span class="glyphicon glyphicon-user"></span> ' + fullName);
          $scope.patientBeforeChanges = angular.copy($scope.patient);
          $scope.addSuccessAlert();
          $scope.formScope.patientForm.$setPristine();
          $scope.posting = false;
        } else {
          // A new patient has been created
          activeContentItem.remove();
          LayoutUtils.openPatient(patient);
        }
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
    $scope.formScope.patientForm.$setDirty();
  };

  $scope.addMotivationalText = function() {
    $scope.patient.motivation_texts.push({
      id: null,
      text: ''
    });
    $scope.formScope.patientForm.$setDirty();
  };

  $scope.addInfoText = function() {
    $scope.patient.information_texts.push({
      id: null,
      text: ''
    });
    $scope.formScope.patientForm.$setDirty();
  };

  $scope.removeNextOfKin = function(index) {
    $scope.patient.next_of_kin.splice(index, 1);
    $scope.formScope.patientForm.$setDirty();
  };

  $scope.removeMotivationalText = function(index) {
    $scope.patient.motivation_texts.splice(index, 1);
    $scope.formScope.patientForm.$setDirty();
  };

  $scope.removeInfoText = function(index) {
    $scope.patient.information_texts.splice(index, 1);
    $scope.formScope.patientForm.$setDirty();
  };

  $scope.moveNextOfKinUp = function(index) {
    var temp = $scope.patient.next_of_kin[index];
    $scope.patient.next_of_kin[index] = $scope.patient.next_of_kin[index - 1];
    $scope.patient.next_of_kin[index - 1] = temp;
    $scope.formScope.patientForm.$setDirty();
  };

  $scope.moveNextOfKinDown = function(index) {
    var temp = $scope.patient.next_of_kin[index];
    $scope.patient.next_of_kin[index] = $scope.patient.next_of_kin[index + 1];
    $scope.patient.next_of_kin[index + 1] = temp;
    $scope.formScope.patientForm.$setDirty();
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

  $scope.setFormScope = function(scope) {
    $scope.formScope = scope;
  };

  function isFieldCollectionValid(fields) {
    if ($scope.formScope && $scope.formScope.patientForm && $scope.isReady) {
      for (var i = 0; i < fields.length; i++) {
        if ($scope.formScope.patientForm[fields[i]] && !$scope.formScope.patientForm[fields[i]].$valid) {
          return false;
        }
      }
    }
    return true;
  }

  $scope.isInfoTabValid = function() {
    return isFieldCollectionValid(['firstName', 'lastName', 'nationalIdentificationNumber']);
  };

  $scope.isThresholdValuesTabValid = function() {
    return isFieldCollectionValid(['o2Min', 'o2Max', 'pulseMin', 'pulseMax', 'temperatureMin', 'temperatureMax']);
  };

  $scope.isNextOfKinTabValid = function() {
    var fields = [];
    for (var i = 0; i < $scope.patient.next_of_kin.length; i++) {
      var prefix = "contact[" + i + "].";
      fields.push(prefix + "fullName");
      fields.push(prefix + "phoneNumber");
      fields.push(prefix + "relation");
    }
    return isFieldCollectionValid(fields);
  };

  $scope.resetForm = function() {
    if (confirm('Dette vil tilbakestille skjemaet til tilstanden det var i forrige gang det ble lagret. Er du sikker?')) {
      setProperties($scope.patientBeforeChanges, $scope.patient);
      $scope.formScope.patientForm.$setPristine();
      $scope.clearAlerts();
    }
  };

  $scope.closeTab = function() {
    SoundRecorder.stopRecording();
    var isConfirmNeeded = $scope.formScope.patientForm.$dirty;
    if (!isConfirmNeeded || confirm('Dette lukke fanen, og du vil miste data du har skrevet inn. Er du sikker?')) {
      var activeContentItem = dashboardLayout.getPatientParentComponent().getActiveContentItem();
      activeContentItem.remove();
    }
  };

  // SOUND RECORDER
  $scope.soundRecorder = SoundRecorder;
  $scope.trustAsResourceUrl = $sce.trustAsResourceUrl;
  $scope.trustAsUrl = $sce.trustAsUrl;

  function getReadyForRecording(motivationalText) {
    motivationalText.isInitializing = true;
    SoundRecorder.initUserMedia();
    SoundRecorder.initialize.promise.then(function() {
      motivationalText.isInitializing = false;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });
  }

  $scope.startRecording = function(motivationalText) {
    if (!SoundRecorder.isInitialized) {
      getReadyForRecording(motivationalText);
      return;
    } else {
      motivationalText.isRecording = true;
      motivationalText.sound = null;
      SoundRecorder.startRecording();
      motivationalText.cancelRecording = $timeout(function() {
        $scope.stopRecording(motivationalText);
      }, SoundRecorder.MAX_RECORD_TIME + 49);
      $scope.updateSoundProgressbar = $interval(function() {
        $scope.elapsedRecordingTime = SoundRecorder.getElapsedTime();
      }, 100, parseInt(SoundRecorder.MAX_RECORD_TIME / 100));
    }
  };

  $scope.stopRecording = function(motivationalText) {
    $timeout.cancel(motivationalText.cancelRecording);
    SoundRecorder.stopRecording();
    motivationalText.isRecording = false;
    motivationalText.isConvertingToMp3 = true;
    $interval.cancel($scope.updateSoundProgressbar);
    $scope.elapsedRecordingTime = 0;
    SoundRecorder.createMp3.promise.then(function(mp3) {
      motivationalText.isConvertingToMp3 = false;
      motivationalText.sound = mp3;
      motivationalText.sound.is_updated = true;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
      $scope.formScope.patientForm.$setDirty();
    });
  };

});
