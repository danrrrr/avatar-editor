import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import loadImageFile from '../../utils/loadImgFile';
import loadImageUrl from '../../utils/loadImgUrl';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.handleImage = this.handleImage.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const context = ReactDOM.findDOMNode(this.canvas).getContext('2d');
    if (this.props.image) {
      this.loadImage(this.props.image); // 加载图片
    }
    this.draw(context);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.image) {
      this.loadImage(newProps.image);
    } else if (!newProps.image) {
      this.clearImage();
    }
  }
  componentDidUpdate() {
    // eslint-disable-next-line react/no-find-dom-node
    const canvas = ReactDOM.findDOMNode(this.canvas);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, 200, 200);
    this.draw(context);
    this.paintImage(context, this.state.image);
  }
  clearImage() {
    const canvas = this.canvas;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  loadImage(image) {
    // eslint-disable-next-line
    if (image instanceof File) {
      loadImageFile(image).then(this.handleImage);
    } else if (typeof image === 'string') {
      loadImageUrl(image, this.props.crossOrigin).then(this.handleImage);
    }
  }
  handleImage(image) {
    // const imageState = this.getInitialSize(image.width, image.height);
    const imageState = { width: 200, height: 200 };
    imageState.resource = image;
    imageState.x = 0.5;
    imageState.y = 0.5;
    this.setState({ drag: false, image: imageState }, this.props.onImageReady);
    this.props.onLoadSuccess(imageState);
  }
  draw(context) {
    context.save();
    context.beginPath();
    context.rect(0, 0, 200, 200);
    context.fill('evenodd');

    context.restore();
  }
  paintImage(context, image) {
    console.log('this is paintImage');
    if (image && image.resource) {
      context.save();
      context.drawImage(image.resource, 0, 0, 200, 200);
      context.restore();
    } else {
      console.error('cant find image.resource');
    }
  }
  render() {
    return (
      <canvas ref={(canvas) => { this.canvas = canvas }}
        style={{ display: 'block' }}></canvas>
    );
  }
}

Preview.propTypes = {
  image: PropTypes.object,
  crossOrigin: PropTypes.oneOf(['', 'anonymous', 'use-credentials']),
  onLoadFailure: PropTypes.func,
  onLoadSuccess: PropTypes.func,
  onImageReady: PropTypes.func,
  onImageChange: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  onPositionChange: PropTypes.func,
};

export default Preview;
