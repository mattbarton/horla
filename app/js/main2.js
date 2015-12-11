/*
[2.03,4.18,7.21,9.08,13.93,16.58,19.26,22.01,23.89,26.63,29.29,32.23,34.88,36.48,38.76,41.81,47.19,49.26,51.81,54.28,57.16,60.3,63.14,65.53,66.79,69.73,72.71,75.44,78.18,79.86,81.96,84.1,85.96,88.68,90.94,92.71,99.91,101.53]
LE HORLA


[23.8,27.15,29.27,32.38,34.22,36.23,39.07,41.53,44.33,47.03,49,51.8,54.25,57.32,59.87,61.63,63.92,67.05,72.32,74.4,76.3,77.52,79.43,82.35,85.45,88.32,90.28,92.03,94.73,98.02,100.52,103.6,105.03,109.28,111.25,113.83,116.05,117.88,125,126.55,132.5,136.9,138.9,147.68,152.55,155.47,158.07,159.9,162.17,163.38,166.77,168.72,170.63,173.08,180.29,183.63,186.98,190.03,192.36,194.71,196.51,198.41,201.33,208.26,213.01,215.79,218.53,223.61,226.65,232.94,235.18,237.68,240.18,242.08,245.75,249.25,252.88,255.28,259.66,260.96,264.61,266.73,270.85]

*/


// var url = 'http://static.kevvv.in/sounds/callmemaybe.mp3',
var url = 'books/horla_extract.mp3',
  playerElement = document.querySelector('.player');

function Player ( url, el ) {
  this.ac = new ( window.AudioContext || webkitAudioContext )();
  this.url = url;
  this.el = el;
  this.button = el.querySelector('.button');
  this.track = el.querySelector('.track');
  this.progress = el.querySelector('.progress');
  this.scrubber = el.querySelector('.scrubber');
  this.message = el.querySelector('.message');

  this.time_position = el.querySelector('.time_position');
  this.textpieces = $("#book span");

  this.message.innerHTML = 'Loading';
  this.bindEvents();
  this.fetch();
  this.marks = [];
  this.cur_para = 0;
  this.marks_el = el.querySelector('.marks');

  this.le_horla_marks = [27.15,29.22,30.08,32.35,34.13,36,39.01,41.49,44.42,47.05,48.95,50.39,51.56,52.79,54.03];
}

Player.prototype.bindEvents = function() {
  this.button.addEventListener('click', this.toggle.bind(this));
  this.scrubber.addEventListener('mousedown', this.onMouseDown.bind(this));
  window.addEventListener('mousemove', this.onDrag.bind(this));
  window.addEventListener('mouseup', this.onMouseUp.bind(this));
};



Player.prototype.fetch = function() {
  //this.decode()
  //var url = URL.createObjectURL(file)
  return
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', this.url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    this.decode(xhr.response);
  }.bind(this);
  xhr.send();
};

Player.prototype.decode = function( arrayBuffer ) {
  this.time_position.innerHTML = "decoding"
  this.ac.decodeAudioData(arrayBuffer, function( audioBuffer ) {
    this.message.innerHTML = '';
    this.buffer = audioBuffer;
    this.draw();
    this.play();
  }.bind(this));
};

Player.prototype.connect = function() {
  if ( this.playing ) {
    this.pause();
  }
  this.source = this.ac.createBufferSource();
  this.source.buffer = this.buffer;
  this.source.connect(this.ac.destination);
};

Player.prototype.play = function( position ) {
  this.connect();
  this.position = typeof position === 'number' ? position : this.position || 0;
  this.startTime = this.ac.currentTime - ( this.position || 0 );
  this.source.start(this.ac.currentTime, this.position);
  this.playing = true;
};

Player.prototype.pause = function() {
  if ( this.source ) {
    this.source.stop(0);
    this.source = null;
    this.position = this.ac.currentTime - this.startTime;
    this.playing = false;
  }
};

Player.prototype.seek = function( time ) {
  if ( this.playing ) {
    this.play(time);
  }
  else {
    this.position = time;
  }
};

Player.prototype.updatePosition = function() {
  this.position = this.playing ?
    this.ac.currentTime - this.startTime : this.position;
  if ( this.position >= this.buffer.duration ) {
    this.position = this.buffer.duration;
    this.pause();
  }
  return this.position;
};

Player.prototype.toggle = function() {
  if ( !this.playing ) {
    this.play();
  }
  else {
    this.pause();
  }
};

Player.prototype.onMouseDown = function( e ) {
  this.dragging = true;
  this.startX = e.pageX;
  this.startLeft = parseInt(this.scrubber.style.left || 0, 10);
};

Player.prototype.onDrag = function( e ) {
  var width, position;
  if ( !this.dragging ) {
    return;
  }
  width = this.track.offsetWidth;
  position = this.startLeft + ( e.pageX - this.startX );
  position = Math.max(Math.min(width, position), 0);
  this.scrubber.style.left = position + 'px';
};

Player.prototype.onMouseUp = function() {
  var width, left, time;
  if ( this.dragging ) {
    width = this.track.offsetWidth;
    left = parseInt(this.scrubber.style.left || 0, 10);
    time = left / width * this.buffer.duration;
    this.seek(time);
    this.dragging = false;
  }
};

Player.prototype.draw = function() {
  var progress = ( this.updatePosition() / this.buffer.duration ),
    width = this.track.offsetWidth;
  if ( this.playing ) {
    this.button.classList.add('fa-pause');
    this.button.classList.remove('fa-play');
  } else {
    this.button.classList.add('fa-play');
    this.button.classList.remove('fa-pause');
  }
  this.progress.style.width = ( progress * width ) + 'px';
  if ( !this.dragging ) {
    this.scrubber.style.left = ( progress * width ) + 'px';
  }

  this.time_position.innerHTML = this.position;

  if (this.cur_para > 0) { $(this.textpieces[this.cur_para - 1]).css("font-weight","normal"); }
  $(this.textpieces[this.cur_para]).css("font-weight","Bold");

  requestAnimationFrame(this.draw.bind(this));
};

function round(value) {
  return Math.round(value*100)/100
}
Player.prototype.saveMark = function() {
  this.marks.push(round(this.position));
  this.marks_el.innerHTML = JSON.stringify(this.marks);
  this.cur_para++;
};
// create a new instance of the player and get things started
window.player = new Player(url, playerElement);

var marks = [];
$(window).keypress(function(event) {
  var M_KEY = 109;
  if (event.which == M_KEY) {
    window.player.saveMark()
  }
})

$(function () {
  document.getElementById("file").addEventListener('change', function(evt) {
    console.log(evt)
    var files = evt.target.files;

    var fileReader = new FileReader;
    fileReader.onload = function() {
      var arrayBuffer = this.result
      window.player.decode(arrayBuffer)
    }
    fileReader.readAsArrayBuffer(files[0])
    
  }, false);
  
  document.getElementById("input_pos").addEventListener('change', function(evt) {
    window.player.pause()
    window.player.seek(evt.target.value)
    
  }, false);
  
})

