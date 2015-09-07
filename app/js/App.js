/**
 *  The main component of the app
 * @module
 */
import React from 'react';
import _ from 'lodash';

import PlayerControls from './PlayerControls';
import TextReader from './TextReader';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      currentFragment: null,
      text: 'Loading',
      marks: [],
      playerStatus: '',
      repeatFrag: false
    };
  }
  loadAudio() {
    //let url = 'books/lehorla_01_maupassant_64kb.mp3';
    let url = 'books/horla_extract.mp3';
    this.props.player.fetch(url);
  }
  loadText() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'books/out.txt', true);
    xhr.onload = () => {
      this.setState({
        text: xhr.response,
        //marks: [23,27.15,29.22,30.08,32.35,34.13,36,39.01,41.49,44.42,47.05,48.95,50.39,51.56,52.79,54.03]
        marks: [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30]
      });
    };
    xhr.send();
  }
  getFragment(time) {
    return -1 + _.findIndex(this.state.marks, (mark) => mark > time);
  }
  getCurrentFragment() {
    return this.getFragment(this.state.currentTime);
  }
  onPlayerStatusChange(event) {
    if (event.hasOwnProperty('status')) {
      this.setState({ playerStatus: event.status });
    }
    if (event.hasOwnProperty('position')) {
      this.setState({currentTime: event.position});
    }
  }
  componentDidMount() {
    this.props.player.setCallback(this.onPlayerStatusChange.bind(this));
  }
  componentWillUnmount() {
    this.props.player.setCallback(null);
  }
  changeFragment(frag_num) {
    console.log('changeFragment');
    console.log(frag_num);
    var time = this.state.marks[frag_num];
    this.props.player.pause();
    this.setState({
      currentTime: time
    });
    var p = this.props.player; // bind for the setTimeout call
    setTimeout(function() {
      p.seek(time);
      p.play();
    }, 1000);
  }
  setRepeatFrag(event) {
    let repeat = event.target.checked;
    if (repeat) {
      this.props.player.repeat({start: 5, end: 8});
    } else {
      this.props.player.repeat(null);
    }
    this.setState({repeatFrag: repeat});
  }

  render() {
    let fragment = this.getCurrentFragment(this.state.currentTime);
    return (
    <div>
      <button onClick={this.loadText.bind(this)}>Load text</button>
      <button onClick={this.loadAudio.bind(this)}>Load audio</button>
      <input type="checkbox" onChange={this.setRepeatFrag.bind(this)} /><label>Repeat</label>
      <div>Repeat: {this.state.repeatFrag}</div>
      <div>Player Status: {this.state.playerStatus}</div>
      <div>Fragment: {fragment}</div>
      <div>Time: {this.state.currentTime}</div>
      <PlayerControls currentTime={this.state.currentTime} player={this.props.player}/>
      <TextReader text={this.state.text} currentFragment={fragment} changeFragment={this.changeFragment.bind(this)} />
     </div>
    );
  }
}
