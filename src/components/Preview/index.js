import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import loadImageFile from '../../utils/loadImgFile';
import loadImageUrl from '../../utils/loadImgUrl';

const INIT_SIZE = 200;
class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initCropAreaWidth: INIT_SIZE,
      initCropAreaHeight: INIT_SIZE,
      cropAreaWidth: INIT_SIZE,
      cropAreaHeight: INIT_SIZE,
      image: {
        x: 0.5,
        y: 0.5
      },
      scaleValue: 1,
      cropResWidth: INIT_SIZE,
      cropResHeight: INIT_SIZE,
    };
    this.handleImage = this.handleImage.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const context = ReactDOM.findDOMNode(this.canvas).getContext('2d');
    if (this.props.image) {
      this.loadImage(this.props.image); // 加载图片
    }
    this.draw(context); // 绘制画布
  }
  componentWillReceiveProps(newProps) {
    if (newProps.image) {
      this.loadImage(newProps.image);
    } else if (!newProps.image) {
      this.clearImage();
    }
    if (newProps.scaleValue) {
      this.setState({
        cropAreaWidth: this.state.initCropAreaWidth * newProps.scaleValue,
        cropAreaHeight: this.state.initCropAreaHeight * newProps.scaleValue
      });
    }
  }
  componentDidUpdate() {
    // eslint-disable-next-line react/no-find-dom-node
    const canvas = ReactDOM.findDOMNode(this.canvas);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, this.props.canvasWidth, this.props.canvasHeight);
    // this.loadImage(this.props.image); // 这里会不断的加载图片
    this.draw(context);
    this.paintImage(context, this.state.image);
  }
  clearImage() {
    const canvas = this.canvas;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  loadImage(image, ctx) {
    // eslint-disable-next-line
    if (image instanceof File) {
      loadImageFile(image).then(this.handleImage);
    } else if (typeof image === 'string') {
      loadImageUrl(image, this.props.crossOrigin).then(this.handleImage);
    }
  }
  handleImage(image) {
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
    // if (imageWHRatio > 1) {
    //   width = this.props.canvasWidth * this.props.scaleValue;
    //   height = (this.props.canvasWidth / image.width * image.height) * this.props.scaleValue;
    // } else {
    //   height = this.props.canvasHeight * this.props.scaleValue;
    //   width = (this.props.canvasHeight / image.height * image.width) * this.props.scaleValue;
    // }
    if (imageWHRatio > 1) {
      width = this.props.canvasWidth * this.state.scaleValue;
      height = (this.props.canvasWidth / image.width * image.height) * this.state.scaleValue;
    } else {
      height = this.props.canvasHeight * this.state.scaleValue;
      width = (this.props.canvasHeight / image.height * image.width) * this.state.scaleValue;
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
  handleMouseDown(e) {
    e.preventDefault();
    this.setState({
      drag: true,
      mx: null,
      my: null,
      startX: e.clientX,
      startY: e.clientY,
      startOriginX: this.state.image.x,
      startOriginY: this.state.image.y
    });
  }
  handleMouseUp(e) {
    if (this.state.drag) {
      this.setState({ drag: false });
    }
  }
  handleMouseMove(e) {
    if (!this.state.drag) {
      return;
    }
    // 计算拖动后的位置
    const positionX = e.clientX - (this.state.startX - this.state.startOriginX);
    const positionY = e.clientY - (this.state.startY - this.state.startOriginY);
    const position = {x: positionX, y: positionY};
    // const position = { x: this.state.startOriginX < 0 ? positionX : 0, y: this.state.startOriginY < 0 ? positionY : 0 };
    // console.log('originX: ', this.state.startOriginX, position, this.state.image.width);
    this.setState({
      image: {...this.state.image, ...position}
    });
  }
  // handleMouseWheel(e) {
  //   console.log(e.deltaY);
  //   if (e.deltaY > 0) {
  //     // 向上滚动 缩小
  //     this.setState({scaleValue: 0.9});
  //   } else {
  //     // 向下滚动 放大
  //     this.setState({scaleValue: 1.1});
  //   }
  // }
  getCropArea() {
    // const position = this.props.position || {
    //   x: this.state.image.x,
    //   y: this.state.image.y
    // };

    // const width = 1 / this.props.scaleValue;
  }
  getImage() {
    const image = this.state.image;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = this.state.cropAreaWidth;
    canvas.height = this.state.cropAreaHeight;
    const sx = 100 / 400 * this.state.image.resource.width;
    const sy = 100 / 400 * this.state.image.resource.height;
    const sw = 200 / 400 * this.state.image.resource.width;
    const sh = 200 / 400 * this.state.image.resource.height;
    context.drawImage(image.resource, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    return canvas;
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
      const imageData = context.getImageData(0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight).data;
      if (!this.state.targetImageData || (imageData && imageData.toString() !== this.state.targetImageData.toString())) {
        this.setState({targetImageData: imageData}); // 这里setstate会出发componentDidUpdate
      }
      context.restore();
    } else {
      console.error('cant find image.resource');
    }
  }
  getTemplateData() {
    // eslint-disable-next-line react/no-find-dom-node
    const ctx = ReactDOM.findDOMNode(this.template).getContext('2d');
    return ctx.getImageData(0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight).data;
  }

  putImageDataToPreview() {
    if (!this.state.targetImageData) {
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = this.state.cropAreaWidth;
    canvas.height = this.state.cropAreaHeight;
    const ctx = canvas.getContext('2d');
    // eslint-disable-next-line react/no-find-dom-node
    const resCtx = ReactDOM.findDOMNode(this.cropRes).getContext('2d');
    let previewImage = ctx.getImageData(0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight);
    let previewData = previewImage.data;
    const tempImageData = this.getTemplateData();
    const targetImageData = this.state.targetImageData;
    for (let i = 0; i < tempImageData.length; i = i + 4) {
      if (tempImageData[i + 3] === 0) {
        previewData[i] = targetImageData[i];
        previewData[i + 1] = targetImageData[i + 1];
        previewData[i + 2] = targetImageData[i + 2];
        previewData[i + 3] = targetImageData[i + 3];
      } else {
        previewData[i + 3] = 0;
      }
    }
    ctx.putImageData(previewImage, 0, 0, 0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight);
    // eslint-disable-next-line
    const cropImage = new Image();
    const _this = this;
    cropImage.src = canvas.toDataURL('image/png');
    cropImage.onload = function() {
      resCtx.drawImage(cropImage, 0, 0, _this.state.cropResWidth, _this.state.cropResHeight);
    };
    // ctx.drawImage(previewImage, 0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight, 0, 0, this.cropResWidth, this.cropResHeight);
  }

  //  <div style={{width: this.props.canvasWidth, height: this.props.canvasHeight, position: 'absolute', left: 0, top: 0, background: '#000', opacity: '0.5'}}></div>
  render() {
    const cropAreaAttr = {
      width: this.state.cropAreaWidth,
      height: this.state.cropAreaHeight,
      style: {
        width: this.state.cropAreaWidth + 'px',
        height: this.state.cropAreaHeight + 'px',
        border: '2px dashed #fff',
        position: 'absolute',
        left: 0,
        top: 0,
        // left: (this.props.canvasWidth - this.state.cropAreaWidth) / 2,
        // top: (this.props.canvasHeight - this.state.cropAreaHeight) / 2,
      }
    };
    return (
      <div style={{ position: 'relative' }}>
        <canvas ref={(canvas) => { this.canvas = canvas }}
          width={this.props.canvasWidth} height={this.props.canvasHeight}
          style={{ display: 'block' }}
          onMouseDown={(event) => this.handleMouseDown(event)}
          onMouseUp={(event) => this.handleMouseUp(event)}
          onMouseMove={(event) => this.handleMouseMove(event)}
          onWheel={(event) => this.handleMouseWheel(event)}
        ></canvas>
        <div className="cropArea" {...cropAreaAttr}>
          <canvas ref={(canvas) => { this.template = canvas }}
            width={this.state.cropAreaWidth} height={this.state.cropAreaHeight}
            style={{ background: '#000', opacity: 0.3 }}
          ></canvas>
        </div>
        <div className="result">
          <canvas ref={(canvas) => { this.cropRes = canvas }}
            width={this.state.cropResWidth} height={this.state.cropResHeight}
            style={{ background: '#ccc' }}
          ></canvas>
        </div>
      </div>
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
  onWheel: PropTypes.func,
};

export default Preview;
