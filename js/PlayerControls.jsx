var PlayerControls = React.createClass({
  render: function() {
    return (
        <div className="player">
            <p className="message"></p>
            <div className="controls">
              <button className="button">Loop sentence</button>
              <button className="button fa fa-play" onClick={this.props.play}></button>
              <button className="button" onClick={this.props.pause}>Pause</button>
            </div>
            <div className="time_position">
              {this.props.position}
            </div>
            <div className="marks"></div>
       </div>
    );
  }
});