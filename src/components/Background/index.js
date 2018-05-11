import React from 'react';
// import PropTypes from 'prop-types';
import './index.scss';
class Background extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <div className="star-bg">
        <canvas ref = {(starsBg) => { this.starsBg = starsBg }}></canvas>
      </div>
    );
  }
}

export default Background;
