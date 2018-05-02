import React from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {

  }
  componentWillReceiveProps(newProps) {

  }
  componentDidUpdate() {

  }

  setGray(data) {
    if (!data) {
      return;
    }
    console.log(data);
    let grayScale;
    for (let i = 0; i < data.length; i = i + 4) {
      grayScale = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = data[i + 1] = data[i + 2] = grayScale;
    }
    this.props.getGray(data);
  }

  render() {
    return (
      <div className="filter-container">
        <button onClick={() => { this.setGray(this.props.targetImageData) }}>灰度化</button>
      </div>
    );
  }
}

Filter.propTypes = {
  targetImageData: PropTypes.array,
  getGray: PropTypes.func,
};

export default Filter;
