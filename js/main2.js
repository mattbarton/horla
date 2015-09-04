// var url = 'http://static.kevvv.in/sounds/callmemaybe.mp3',
var url = 'books/lehorla_01_maupassant_64kb.mp3',
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
  var xhr = new XMLHttpRequest();
  xhr.open('GET', this.url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    this.decode(xhr.response);
  }.bind(this);
  xhr.send();
};

Player.prototype.decode = function( arrayBuffer ) {
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
