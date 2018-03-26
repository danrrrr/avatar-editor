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
  }

  componentDidMount() {
    console.log('this is preview');
    // eslint-disable-next-line react/no-find-dom-node
    const context = ReactDOM.findDOMNode(this.canvas).getContext('2d');
    const { image } = this.props;
    this.loadImage(image); // 加载图片
    this.draw(context);
  }
  loadImage(image) {
    // eslint-disable-next-line
    if (image instanceof File) {
      console.log('file', image);
      loadImageFile(image).then(this.handleImage);
    } else if (typeof image === 'string') {
      console.log('url', image);
      loadImageUrl(image, this.props.crossOrigin).then(this.handleImage);
    }
  }
  handleImage(image) {
    // const imageState = this.getInitialSize(image.width, image.height);
    const imageState = {width: 200, height: 200};
    imageState.resource = image;
    imageState.x = 0.5;
    imageState.y = 0.5;
    this.setState({ drag: false, image: imageState });
  }
  draw(context) {
    context.save();
    context.beginPath();
    context.rect(0, 0, 200, 200);
    context.fill('evenodd');

    context.restore();
  }
  render() {
    return (
      <canvas ref={(canvas) => { this.canvas = canvas }}
        style={{display: 'block'}}></canvas>
    );
  }
}

Preview.propTypes = {
  image: PropTypes.object,
  crossOrigin: PropTypes.oneOf(['', 'anonymous', 'use-credentials']),
};

export default Preview;
