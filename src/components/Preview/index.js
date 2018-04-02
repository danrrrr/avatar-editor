import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import loadImageFile from '../../utils/loadImgFile';
import loadImageUrl from '../../utils/loadImgUrl';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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
    context.clearRect(0, 0, this.props.canvasWidth, this.props.canvasHeight);
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
    const { width, height } = this.getImageSize(image);
    const { axisX, axisY } = this.getInitPostion(image);
    const imageState = { width: width, height: height };
    imageState.resource = image;
    imageState.x = axisX;
    imageState.y = axisY;
    this.setState({ drag: false, image: imageState });
  }

  getWHRatio(w, h) {
    return w / h;
  }

  // 图片长边与canvas的宽度一致，另一边按比例缩放
  getImageSize(image) {
    const imageWHRatio = this.getWHRatio(image.width, image.height);
    let width = 0;
    let height = 0;
    if (imageWHRatio > 1) {
      width = this.props.canvasWidth * this.props.scaleValue;
      height = (this.props.canvasWidth / image.width * image.height) * this.props.scaleValue;
    } else {
      height = this.props.canvasHeight * this.props.scaleValue;
      width = (this.props.canvasHeight / image.height * image.width) * this.props.scaleValue;
    }

    return { width, height };
  }
  // 图片位置居中, width>height上下留白 width<height 左右留白
  getInitPostion(image) {
    const imageWHRatio = this.getWHRatio(image.width, image.height);
    const { width, height } = this.getImageSize(image);
    let axisX, axisY;
    if (imageWHRatio > 1) {
      axisX = (this.props.canvasWidth - width) / 2;
      axisY = (this.props.canvasHeight - height) / 2;
    } else {
      axisX = (this.props.canvasWidth - width) / 2;
      axisY = (this.props.canvasHeight - height) / 2;
    }
    return { axisX, axisY };
  }
  draw(context) {
    context.save();
    context.beginPath();
    context.rect(0, 0, this.props.canvasWidth, this.props.canvasHeight);
    context.fill('evenodd');

    context.restore();
  }
  paintImage(context, image) {
    if (image && image.resource) {
      context.save();
      context.drawImage(image.resource, image.x, image.y, this.state.image.width, this.state.image.height);
      context.restore();
    } else {
      console.error('cant find image.resource');
    }
  }
  render() {
    return (
      <canvas ref={(canvas) => { this.canvas = canvas }}
        width={this.props.canvasWidth} height={this.props.canvasHeight}
        style={{ display: 'block' }}></canvas>
    );
  }
}

Preview.propTypes = {
  image: PropTypes.object,
  scaleValue: PropTypes.number,
  canvasWidth: PropTypes.number,
  canvasHeight: PropTypes.number,
  crossOrigin: PropTypes.oneOf(['', 'anonymous', 'use-credentials']),
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  onPositionChange: PropTypes.func,
};

export default Preview;
