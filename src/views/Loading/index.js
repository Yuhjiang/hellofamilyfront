import React, {Component} from 'react';

import "./loading.css";

class Loading extends Component {
  render() {
    return (
      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    );
  }
}

export default Loading;