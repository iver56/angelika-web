angelikaServices.service('SoundRecorder', function() {
  this.recorder = null;
  this.audioContext = null;
  this.isRecorderInitializing = false;
  this.isRecorderInitialized = false;
  this.isRecording = false;
  this.convertingToMp3 = false;
  this.mp3 = null;
  var that = this;

  dashboardLayout.on('convertingToMp3', function() {
    this.convertingToMp3 = true;
  });

  dashboardLayout.on('mp3Created', function(mp3Object) {
    this.mp3 = mp3Object;
    console.log(this.mp3);
    this.convertingToMp3 = false;
  });

  this.startUserMedia = function(stream) {
    var input = that.audioContext.createMediaStreamSource(stream);
    console.log('Media stream created.');
    console.log("input sample rate " + input.context.sampleRate);

    that.recorder = new Recorder(input);
    console.log('Recorder initialised.');
    that.isRecorderInitialized = true;
    that.isRecorderInitializing = false;
  };

  this.initUserMedia = function() {
    if (this.isRecorderInitializing) {
      return;
    }
    this.isRecorderInitializing = true;
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
      window.URL = window.URL || window.webkitURL;

      this.audioContext = new AudioContext;
      console.log('Audio context set up.');
      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      this.isRecorderInitializing = false;
      alert('Beklager, denne nettleseren støtter ikke lydopptak. Prøv Chrome, Firefox eller Opera.');
    }

    navigator.getUserMedia({audio: true}, this.startUserMedia, function(e) {
      this.isRecorderInitializing = false;
      alert('Feil: Fikk ikke tilgang til lyd-inndata på datamaskinen');
      console.log('No live audio input: ' + e);
    });

  };

  this.startRecording = function() {
    if (this.isRecording) {
      return;
    }
    if (!this.isRecorderInitialized && !this.isRecorderInitializing) {
      this.initUserMedia();
      console.log('initing user media');
      return;
    }
    this.recorder && this.recorder.record();
    this.isRecording = true;
    console.log('Recording...');
  };

  this.stopRecording = function() {
    if (!this.isRecording) {
      return;
    }
    this.recorder && this.recorder.stop();
    this.isRecording = false;
    console.log('Stopped recording.');

    // create WAV download link using audio data blob
    this.createDownloadLink();

    this.recorder.clear();
  };

  this.createDownloadLink = function() {
    this.recorder && this.recorder.exportWAV(function(blob) {
      //wav ready, still waiting for mp3
    });
  };

});
