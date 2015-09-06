/**
 * A simple wrapper that calls the App react component
 */

import React from 'react';
import App from './js/App';
import Player from './js/Player';

export default React.render(
  <App player={Player()}/>, 
  document.querySelector('#app-container')
);


