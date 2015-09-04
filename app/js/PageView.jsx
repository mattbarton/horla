var View = React.createClass({
  getInitialState: function() {
    return {
      position: 0,
      fragment: null
    }
  },
  componentDidMount: function() {
    this.props.player.setCallback(this.updatePos);
  },  
  componentWillUnmount: function() {
    this.props.player.setCallback(function() {});
  },  
  updatePos: function(newpos) {
    this.setState({
      position: newpos,
      fragment: -1 + _.findIndex(marks, function(x) { return x > newpos } )
    });
  },
  updateFragment: function(frag_num) {
  },
  changeFragment: function(frag_num) {
    console.log(frag_num);
    var position = marks[frag_num];
    this.props.player.pause();
    this.setState({
      position: position,
      fragment: frag_num
    });
    var p = this.props.player; // bind for the setTimeout call
    setTimeout(function() {
      p.play(position);
     }, 1000);
  },
  
  render: function() {
    return (
    <div>
      <div>Fragment: {this.state.fragment}</div>
      <div>Position: {this.state.position}</div>
      <PlayerControls position={this.state.position} play={myplayer.play} pause={myplayer.pause}/>
      <PageText text={textPage} changepos={this.changeFragment} fragment={this.state.fragment} />
     </div>
    );
  }
});