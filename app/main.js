import React from 'react';
import App from './js/App';
import Player from './js/Player';

let player = Player({
  url: 'books/lehorla_01_maupassant_64kb.mp3'
})

export default React.render(
  <App player={player}/>, 
  document.querySelector('#app-container')
);


