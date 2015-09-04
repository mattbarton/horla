/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var marks = [23,27.15,29.22,30.08,32.35,34.13,36,39.01,41.49,44.42,47.05,48.95,50.39,51.56,52.79,54.03];

	// create a new instance of the player and get things started
	var url = 'books/lehorla_01_maupassant_64kb.mp3';
	var player = __webpack_require__(1)({url: url});
	var PlayerControls = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./PlayerControls\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	React.render(
	  React.createElement(PlayerControls, null)
	  ,document.getElementById('PlayerControls')
	);


/***/ },
/* 1 */
/***/ function(module, exports) {

	// CommonJS module, needs browserify to work in browser
	// import using:
	// var player = require('player')({url: 'http'})

	var ac = new (window.AudioContext || webkitAudioContext)();
	var status = 'Loading';
	var url = 'Required parameter'
	var cur_para = 0;
	var buffer;
	var playing = false;
	var source;
	var position;
	var startTime;
	var callback;

	function fetch() {
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', url, true);
	  xhr.responseType = 'arraybuffer';
	  xhr.onload = function() {
	    decode(xhr.response);
	  };
	  xhr.send();
	};

	function decode(arrayBuffer) {
	  ac.decodeAudioData(arrayBuffer, function(audioBuffer) {
	    status = 'Ready';
	    buffer = audioBuffer;
	    play();
	  });
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

	module.exports = function(opts) {
	  url = opts.url;
	  // callback gets called with position updates every 100ms or so
	  callback = opts.callback || function() {};
	  fetch();
	  return {
	    play: play,
	    pause: pause,
	    seek: seek,
	    setCallback: setCallback
	  }
	}


/***/ }
/******/ ]);