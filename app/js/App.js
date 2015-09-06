/**
 *  The main component of the app
 * @module
 */
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
      marks: [],
      audio: 'No audio',
      repeatFrag: false
    };
  }
  loadAudio() {
    let url = 'books/lehorla_01_maupassant_64kb.mp3';
    this.props.player.fetch(url, () => {
      this.setState({
        audio: 'Ready'
      });
    });
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
  getFragment(time) {
    return -1 + _.findIndex(this.state.marks, (mark) => mark > time)
  }
  getCurrentFragment() {
    return this.getFragment(this.state.time);
  }
  onTimeChange(time) {
    if (this.state.repeatFrag && this.getFragment(time) !== this.getCurrentFragment()) {
      console.log('repeat');
      changeFragment(getCurrentFragment());
    } else {
      this.setState({currentTime: time});
    }
  }
  componentDidMount() {
    this.props.player.setCallback(this.onTimeChange.bind(this));
  }
  componentWillUnmount() {
    this.props.player.setCallback(function() {});
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
  setRepeatFrag(event) {
    this.setState({repeatFrag: event.target.value});
  }
  
  render() {
    let fragment = this.getCurrentFragment(this.state.currentTime);
    return (
    <div>
      <button onClick={this.loadText.bind(this)}>Load text</button>
      <button onClick={this.loadAudio.bind(this)}>Load audio</button>
      <input type="checkbox" onChange={this.setRepeatFrag.bind(this)} /><label>Repeat</label>
      <div>Audio: {this.state.audio}</div>
      <div>Fragment: {fragment}</div>
      <div>Time: {this.state.currentTime}</div>
      <PlayerControls currentTime={this.state.currentTime} player={this.props.player}/>
      <TextReader text={this.state.text} currentFragment={fragment} changeFragment={this.changeFragment.bind(this)} />
     </div>
    );
  }
}
