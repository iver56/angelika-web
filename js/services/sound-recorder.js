angelikaServices.service('SoundRecorder', function($q) {
  this.recorder = null;
  this.audioContext = null;
  this.isInitializing = false;
  this.isInitialized = false;
  this.isRecording = false;
  this.isConvertingToMp3 = false;
  this.mp3 = null;
  this.initialize = null;
  this.record = null;
  this.createMp3 = null;
  this.timeRecordingStarted = null;
  this.MAX_RECORD_TIME = 20000; //milliseconds
  var that = this;

  dashboardLayout.on('mp3Created', function(mp3Object) {
    that.mp3 = mp3Object;
    that.isConvertingToMp3 = false;
    that.createMp3.resolve(that.mp3);
  });

  this.startUserMedia = function(stream) {
    if (!that.isInitializing) {
      return {status: "USER_MEDIA_NOT_INITIALIZED"};
    }
    var input = that.audioContext.createMediaStreamSource(stream);
    that.recorder = new Recorder(input);
    that.isInitialized = true;
    that.isInitializing = false;
    that.initialize.resolve();
  };

  this.initUserMedia = function() {
    if (this.isInitializing) {
      return;
    }
    this.isInitializing = true;
    this.initialize = $q.defer();
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
      window.URL = window.URL || window.webkitURL;

      this.audioContext = new AudioContext;
    } catch (e) {
      this.isInitializing = false;
      this.initialize.reject();
      alert('Beklager, denne nettleseren støtter ikke lydopptak. Prøv Chrome, Firefox eller Opera.');
    }

    navigator.getUserMedia({audio: true}, this.startUserMedia, function(e) {
      that.isInitializing = false;
      that.initialize.reject();
      alert('Fikk ikke tilgang til lyd-inndata. For å kunne spille inn en talebeskjed,' +
        ' må du tillate at Angelika får tilgang til lyd-inndata.');
    });

  };

  this.startRecording = function() {
    if (this.isRecording) {
      return {status: "ALREADY_RECORDING"};
    } else if (!this.isInitialized) {
      return {status: "NOT_READY_FOR_RECORDING"};
    } else {
      this.recorder && this.recorder.record();
      this.timeRecordingStarted = Date.now();
      this.isRecording = true;
      this.record = $q.defer();
      return {status: "RECORDING"};
    }
  };

  this.stopRecording = function() {
    if (!this.isRecording) {
      return {status: "NO_RECORDING_IN_PROGRESS"};
    } else {
      this.recorder && this.recorder.stop();
      this.createMp3 = $q.defer();
      this.isRecording = false;
      this.isConvertingToMp3 = true;
      this.record.resolve();
      this.createDownloadLink();

      this.recorder.clear();
    }
  };

  this.createDownloadLink = function() {
    this.recorder && this.recorder.exportWAV(function(blob) {
      //wav ready, still waiting for mp3
    });
  };

  this.getElapsedTime = function() {
    if (null === that.timeRecordingStarted) {
      return null;
    }
    return Date.now() - that.timeRecordingStarted;
  }

});
