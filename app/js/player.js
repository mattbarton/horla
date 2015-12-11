/**
 * callback gets called with position updates every 100ms or so
 */
export default function() {
  return {
    fetch,
    play,
    pause,
    seek,
    setCallback
  }
}

var ac = new (window.AudioContext || webkitAudioContext)();
var status = 'Loading';
var urlLast = '';
var cur_para = 0;
var buffer;
var playing = false;
var source;
var position;
var startTime;
var callback;

function fetch(url, fetchCallback) {
  urlLast = url; // keep track of which url we loaded from, for info
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    ac.decodeAudioData(xhr.response, function(audioBuffer) {
      status = 'Ready';
      buffer = audioBuffer;
      fetchCallback();
    });
  };
  xhr.send();
};

function decode(arrayBuffer) {
};

function connect() {
  if (playing) {
    pause();
  }
  source = ac.createBufferSource();
  source.buffer = buffer;
  source.connect(ac.destination);
};

function play(pos) {
  connect();
  position = typeof pos === 'number' ? pos : position || 0;
  startTime = ac.currentTime - (position || 0);
  source.start(ac.currentTime, position);
  playing = true;
  setTimeout(timerCall, 100);
};

function pause() {
  if (source) {
    source.stop(0);
    source = null;
    position = ac.currentTime - startTime;
    playing = false;
  }
};

function seek(time) {
  if (playing) {
    play(time);
  } else {
    position = time;
  }
};

function updatePosition() {
  position = playing ? ac.currentTime - startTime : position;
  if (position >= buffer.duration) {
    position = buffer.duration;
    pause();
  }
  return position;
};

function toggle() {
  if (!playing) {
    play();
  } else {
    pause();
  }
};

function timerCall() {
  if (playing) {
    updatePosition();
    callback(position);
    setTimeout(timerCall, 100);    
  }
}

function setCallback(func) {
  callback = func;
}

