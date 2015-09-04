var React = require('react')

var marks = [23,27.15,29.22,30.08,32.35,34.13,36,39.01,41.49,44.42,47.05,48.95,50.39,51.56,52.79,54.03];

// create a new instance of the player and get things started
var url = 'books/lehorla_01_maupassant_64kb.mp3';
var player = require('./player')({url: url});
var PlayerControls = require('./PlayerControls')

React.render(
  React.createElement(PlayerControls, null)
  ,document.getElementById('PlayerControls')
);
