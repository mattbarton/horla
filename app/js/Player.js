/**
 * All exported functions are idempotent
 * callback gets called with position updates every 100ms or so
 */
export default function() {
  return {
    fetch,
    play,
    pause,
    seek,
    repeat,
    setCallback
  };
}

const ac = new (window.AudioContext || window.webkitAudioContext)();
let buffer = null;  // if buffer is null, we have not yet loaded the sound file
let source = null;  // we are playing music iff source is truthy
let startTime = null; // the ac.currentTime at the time we start playback. Measure elapsed time relative to this.
let position = 0; // holds the position we would want to restart playback at, after a pause-play combo
let callback = null;
let loop = null;

/**
 * Param is {start:1, end:2} or null for no repeat
 */
function repeat(r) {
  loop = r;
  // if we're already past the end of the looping section, reset to the start of the looping section
  if (loop && position >= loop.end) {
    seek(loop.start);
  }
}

function publish(event) {
  if (callback) {
    callback(event);
  }
}

function fetch(url) {
  pause();
  buffer = null;
  publish({status: 'Loading'});
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    publish({status: 'Decoding'});
    ac.decodeAudioData(xhr.response, function(audioBuffer) {
      console.log('decoded');
      buffer = audioBuffer;
      publish({status: 'Ready'});
    });
  };
  xhr.send();
}

function play() {
  if (buffer) {
    pause();
    source = ac.createBufferSource();
    source.buffer = buffer;
    source.connect(ac.destination);
    startTime = ac.currentTime - (position || 0);
    source.start(ac.currentTime, position);
  } else {
    console.log('Tried to play, but buffer is empty');
  }
}

function pause() {
  if (isPlaying()) {
    source.stop(0);
    source = null;
    position = ac.currentTime - startTime; // store the position, so that we can recommence from here upon play()
  }
}

function seek(time) {
  let playing = isPlaying();
  pause();
  console.log('seek' + time);
  console.log(position);
  position = time;
  publish({position: position});
  if (playing) {
    play(); // restart playback from new position, if it was already playing (not paused)
  }
}

function updatePosition() {
  if (isPlaying()) {
    position = ac.currentTime - startTime;
  }
  if (loop && position >= loop.end) {
    seek(loop.start);
  } else if (position >= buffer.duration) {
    position = buffer.duration;
    pause();
  }
}

function isPlaying() {
  return (source != null);
}

/**
 * This runs all the time, but only does anything interesting if the player isPlaying
 */
function timerCall() {
  if (isPlaying()) {
    updatePosition();
    publish({position: position});
  }
  window.requestAnimationFrame(timerCall);
}
window.requestAnimationFrame(timerCall);

function setCallback(func) {
  callback = func;
}

