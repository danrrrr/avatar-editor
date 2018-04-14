import React from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import loadImageFile from '../../utils/loadImgFile';
import loadImageUrl from '../../utils/loadImgUrl';
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
    this.handleCustomImage = this.handleCustomImage.bind(this);
  }
  componentDidMount() {

  }
  componentWillReceiveProps(newProps) {
    if (newProps.customImage !== this.props.customImage) {
      this.loadCustomImage(newProps.customImage);
    }
  }
  componentDidUpdate() {

  }
  getTempImage(event) {
    this.props.getTempImages(event);
  }
  loadCustomImage(image) {
    // eslint-disable-next-line
    if (image instanceof File) {
      loadImageFile(image).then(this.handleCustomImage);
    } else if (typeof image === 'string') {
      loadImageUrl(image, this.props.crossOrigin).then(this.handleCustomImage);
    }
  }
  handleCustomImage(image) {
    const images = this.state.images;
    this.setState({
      images: [...images, image.src]
    });
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
  getTemplateData: PropTypes.func,
  customImage: PropTypes.object,
  crossOrigin: PropTypes.oneOf(['', 'anonymous', 'use-credentials']),
};

export default Templates;
