import React from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import './index.scss';
import circle from '../../images/circle.png';
import star from '../../images/star.png';
import heart from '../../images/heart.png';

class Templates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [circle, star, heart],
    };
  }
  componentDidMount() {

  }
  componentWillReceiveProps(newProps) {
    // const images = this.state.images;
    // if (newProps.customImage !== this.props.customImage) {
    //   this.setState({
    //     images: [...images, newProps.customImage]
    //   });
    // }
  }
  componentDidUpdate() {

  }
  getTempImage(event) {
    this.props.getTempImages(event);
  }

  render() {
    const images = this.state.images;
    return (
      <div className="templates-container">
        <div className="images">
          {images && images.map((item, index) => {
            return (
              <img className="temp-item" src={item} key={index}
                onClick={(event) => { this.getTempImage(event) }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

Templates.propTypes = {
  getTempImages: PropTypes.func,
  customImage: PropTypes.object,
};

export default Templates;
