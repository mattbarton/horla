
import React from 'react';

export default class PlayerControls extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let p = this.props.player;
    return (
        <div className="player">
            <p className="message"></p>
            <div className="controls">
              <button className="button">Loop sentence</button>
              <button className="button fa fa-play" onClick={p.play}></button>
              <button className="button" onClick={p.pause}>Pause</button>
            </div>
            <div className="time_position">
              {this.props.currentTime}
            </div>
            <div className="marks"></div>
       </div>
    );
  }
}
