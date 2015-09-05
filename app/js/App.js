import React from 'react';

import PlayerControls from './PlayerControls'
import TextReader from './TextReader'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      currentFragment: null,
      text: 'Loading',
      marks: []
    };
  }
  loadText() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'books/out.txt', true);
    xhr.onload = (resp) => {
      this.setState({
        text: xhr.response,
        marks: [23,27.15,29.22,30.08,32.35,34.13,36,39.01,41.49,44.42,47.05,48.95,50.39,51.56,52.79,54.03]
      });
    };
    xhr.send();
  }
  componentDidMount() {
    this.props.player.setCallback((time) => this.setState({currentTime: time}));
  }
  componentWillUnmount() {
    this.props.player.setCallback(function() {});
  }  
  getCurrentFragment() {
      return -1 + _.findIndex(this.state.marks, (x) => x > this.state.currentTime)
  }
  changeFragment(frag_num) {
    console.log(frag_num);
    var time = this.state.marks[frag_num];
    this.props.player.pause();
    this.setState({
      currentTime: time
    });
    var p = this.props.player; // bind for the setTimeout call
    setTimeout(function() {
      p.play(time);
     }, 1000);
  }
  
  render() {
    let fragment = this.getCurrentFragment(this.state.currentTime);
    return (
    <div>
      <button onClick={this.loadText.bind(this)}>Load text</button>
      <div>Fragment: {fragment}</div>
      <div>Time: {this.state.currentTime}</div>
      <PlayerControls currentTime={this.state.currentTime} player={this.props.player}/>
      <TextReader text={this.state.text} currentFragment={fragment} changeFragment={this.changeFragment.bind(this)} />
     </div>
    );
  }
}
