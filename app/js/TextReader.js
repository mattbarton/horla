
import React from 'react';
var css = require('./TextReader.css');

export default class TextReader extends React.Component {
  constructor(props) {
    super(props);
  }
  onClick(index) {
    this.props.changeFragment(index);
    console.log(index);
  }
  render() {
    let lines = this.props.text.split('\n').slice(0, 100);
    let out = lines.map((line, index) => {
      let className = "";
      let text = "";
      if (line.indexOf('PARAGRAPH BREAK') > -1) {
        className = "para-break";
      } else {
        className = "fragment";
        text = line;
        if (this.props.currentFragment == index) {
          className += " highlight";
        }
      }
      return <div className={className} key={index} frag={index} onClick={this.onClick.bind(this, index)}>{text}</div>
    });
    return (
      <div>{out}</div>
    );
  }
}