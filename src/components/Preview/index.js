import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import loadImageFile from '../../utils/loadImgFile';
import loadImageUrl from '../../utils/loadImgUrl';
// import CropBox from '../CropBox';
import Templates from '../Templates';
// import CropRes from '../CropRes';
// import Filter from '../Filter';
import './index.scss';

const INIT_SIZE = 200;
const BORDER_WIDTH = 2;
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
      templateX: 0,
      templateY: 0,
      setGray: false,
      setOld: false,
    };
    this.handleImage = this.handleImage.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const context = ReactDOM.findDOMNode(this.canvas).getContext('2d');
    if (this.props.image) {
      this.loadImage(this.props.image); // 加载图片
    }
    // templateXY是相对于画布的位置
    this.setState({
      templateX: (this.props.canvasWidth - this.state.cropAreaWidth) / 2,
      templateY: (this.props.canvasHeight - this.state.cropAreaHeight) / 2
    });
    this.draw(context); // 绘制画布
    // eslint-disable-next-line react/no-find-dom-node
    const ctx = ReactDOM.findDOMNode(this.template).getContext('2d');
    let templateImgData = ctx.getImageData(0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight).data;
    for (let i = 0; i < templateImgData.length; i++) {
      templateImgData[i] = 255;
    }
    this.setState({
      templateImgData: templateImgData
    });
  }
  componentWillReceiveProps(newProps) {
    // 图片改变（重传或大小改变）重新加载图片
    if ((newProps.image && newProps.image !== this.props.image) || newProps.canvasWidth !== this.props.canvasWidth || newProps.canvasHeight !== this.props.canvasHeight) {
      this.loadImage(newProps.image);
      this.setState({
        templateX: (this.props.canvasWidth - INIT_SIZE) / 2,
        templateY: (this.props.canvasHeight - INIT_SIZE) / 2
      });
      this.clearImage(this.cropRes);
    } else if (!newProps.image) {
      this.clearImage(this.canvas);
    }
    if (newProps.scaleValue !== this.props.scaleValue) {
      this.setState({
        cropAreaWidth: this.state.initCropAreaWidth * newProps.scaleValue,
        cropAreaHeight: this.state.initCropAreaHeight * newProps.scaleValue
      });
    }
    if (newProps.customImage !== this.props.customImage) {
      this.clearImage(this.cropRes);
      this.clearImage(this.template);
    }
  }
  componentDidUpdate() {
    // eslint-disable-next-line react/no-find-dom-node
    const canvas = ReactDOM.findDOMNode(this.canvas);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, this.props.canvasWidth, this.props.canvasHeight);
    this.draw(context);
    this.paintImage(context, this.state.image);
    // this.updateImage();
  }
  updateImage() {
    if (!this.state.targetImageData) {
      return;
    }
    this.clearImage(this.canvas);
    // eslint-disable-next-line react/no-find-dom-node
    const canvas = ReactDOM.findDOMNode(this.canvas);
    const context = canvas.getContext('2d');
    console.log(this.state.targetImageData);
    // eslint-disable-next-line
    const image = new Image();
    image.src = this.state.image.resource.src;
    console.log(image);
    const _this = this;
    image.onload = function() {
      console.log('onload');
      context.drawImage(image, image.x, image.y, _this.state.image.width, _this.state.image.height);
      context.putImageData(_this.state.targetImageObj, 0, 0);
    };
  }
  clearImage(canvas) {
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
  getElementClient(ele) {
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(ele).getBoundingClientRect();
  }
  handleMouseDown(e) {
    e.preventDefault();
    console.log(this.canvas);
    const canvasObj = this.getElementClient(this.canvas);
    const obj = this.getElementClient(this.template);
    this.setState({
      drag: true,
      mx: null,
      my: null,
      startX: e.clientX, // 鼠标相对于浏览器视口的坐标
      startY: e.clientY,
      // 这里应该是绝对位置而不是相对于视口的位置
      startLeft: obj.left - canvasObj.left,
      startTop: obj.top - canvasObj.top,
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
    // const canvasObj = this.getElementClient(this.canvas);
    // const obj = this.getElementClient(this.template);
    // 计算裁剪框拖动后的位置
    // 裁剪框位置不应该超出图片
    let positionX = e.clientX - this.state.startX + this.state.startLeft;
    let positionY = e.clientY - this.state.startY + this.state.startTop;

    const minPosX = (this.props.canvasWidth - this.state.image.width) / 2;
    const minPosY = (this.props.canvasHeight - this.state.image.height) / 2;
    const maxPosY = this.props.canvasHeight - minPosY - this.state.cropAreaHeight;
    const maxPosX = this.props.canvasWidth - minPosX - this.state.cropAreaWidth;
    if (positionX <= minPosX) {
      positionX = minPosX;
    } else if (positionX >= maxPosX) {
      positionX = maxPosX;
    }
    if (positionY <= minPosY) {
      positionY = minPosY;
    } else if (positionY >= maxPosY) {
      positionY = maxPosY;
    }

    this.setState({
      templateX: positionX,
      templateY: positionY
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
  draw(context) {
    context.save();
    context.beginPath();
    context.rect(0, 0, this.props.canvasWidth, this.props.canvasHeight);
    // context.fillStyle = '#ccc';
    // context.fill('evenodd');

    context.restore();
  }
  paintImage(context, image) {
    if (image && image.resource) {
      context.save();
      context.drawImage(image.resource, image.x, image.y, this.state.image.width, this.state.image.height);

      // 获取元素的位置及size信息，位置是相对于视口的距离
      const obj = this.getElementClient(this.template);
      const canvasObj = this.getElementClient(this.canvas);
      const imageObj = context.getImageData(obj.left - canvasObj.left, obj.top - canvasObj.top, this.state.cropAreaWidth, this.state.cropAreaHeight);
      // const imageObj = context.getImageData(obj.left - canvasObj.left, obj.top - canvasObj.top, this.state.image.width, this.state.image.height);
      const imageData = imageObj.data;
      if (!this.state.targetImageData || (imageData && imageData.toString() !== this.state.targetImageData.toString())) {
        this.setState({
          targetImageData: imageData,
          targetImageObj: imageObj
        }); // 这里setstate会触发componentDidUpdate
      }
      context.restore();
    } else {
      // console.error('cant find image.resource');
    }
  }
  getTemplateData() {
    // eslint-disable-next-line react/no-find-dom-node
    const ctx = ReactDOM.findDOMNode(this.template).getContext('2d');
    // eslint-disable-next-line
    const templateImg = new Image();
    let templateImgData;
    if (!this.state.templateImg) {
      templateImgData = ctx.getImageData(0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight).data;
      for (let i = 0; i < templateImgData.length; i++) {
        templateImgData[i] = 255;
      }
      this.setState({
        templateImgData: templateImgData
      });
    } else {
      templateImg.src = this.state.templateImg;
      const _this = this;
      templateImg.onload = function() {
        // 将模板图片绘制到canvas中，然后获取imgCtx的data数据，更改data数据
        ctx.drawImage(templateImg, 0, 0, templateImg.width, templateImg.height, 0, 0, _this.state.cropAreaWidth, _this.state.cropAreaHeight);
        templateImgData = ctx.getImageData(0, 0, _this.state.cropAreaWidth, _this.state.cropAreaHeight).data;
        _this.setState({
          templateImgData: templateImgData
        });
      };
    }
  }

  showRes() {
    this.cropres.putImageDataToPreview();
  }

  putImageDataToPreview() {
    if (!this.state.targetImageData) {
      return;
    }
    this.clearImage(this.cropRes);
    const canvas = document.createElement('canvas');
    canvas.width = this.state.cropAreaWidth;
    canvas.height = this.state.cropAreaHeight;
    const ctx = canvas.getContext('2d');
    // eslint-disable-next-line react/no-find-dom-node
    const resCtx = ReactDOM.findDOMNode(this.cropRes).getContext('2d');

    let previewImage = ctx.getImageData(0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight);
    let previewData = previewImage.data;
    const tempImageData = this.state.templateImgData;
    if (!tempImageData) {
      return;
    }
    const targetImageData = this.state.targetImageData;
    for (let i = 0; i < tempImageData.length; i = i + 4) {
      if (tempImageData[i + 3] !== 0) {
        previewData[i] = targetImageData[i];
        previewData[i + 1] = targetImageData[i + 1];
        previewData[i + 2] = targetImageData[i + 2];
        previewData[i + 3] = targetImageData[i + 3];
      } else {
        previewData[i + 3] = 0;
      }
    }
    this.setState({
      previewImageData: previewImage
    });
    ctx.putImageData(this.state.previewImageData, 0, 0, 0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight);
    // eslint-disable-next-line
    const cropImage = new Image();
    const _this = this;
    cropImage.src = canvas.toDataURL('image/png');
    cropImage.onload = function() {
      resCtx.drawImage(cropImage, 0, 0, _this.state.cropResWidth, _this.state.cropResHeight);
    };
    // ctx.drawImage(previewImage, 0, 0, this.state.cropAreaWidth, this.state.cropAreaHeight, 0, 0, this.cropResWidth, this.cropResHeight);
  }
  getTempImages(res) {
    this.clearImage(this.cropRes);
    this.clearImage(this.template);
    this.setState({
      templateImg: res.target.src
    });
    this.getTemplateData();
  }
  setFilter(imageData) {
    // console.log(e.currentTarget.value);
    if (!this.state.targetImageData) {
      return;
    }
    this.setGray(imageData);
    // let targetImageData = this.state.targetImageData;
    // let resData = this.setGray(targetImageData);
    // this.setState({
    //   targetImageData: resData
    // });
    // console.log('yeah');
  }
  setGray() {
    // this.setState({
    //   setGray: true,
    //   setOld: false
    // });
    this.clearImage(this.cropRes);
    let targetObj = this.state.previewImageData;
    let data = targetObj.data;
    if (!data) {
      return;
    }
    let grayScale;
    for (let i = 0; i < data.length; i = i + 4) {
      grayScale = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = data[i + 1] = data[i + 2] = grayScale;
    }
    this.setState({
      previewImageData: targetObj
    });
    this.putImageDataToPreview();
  }
  // 怀旧滤镜
  reminiscenceFilter() {
    this.clearImage(this.cropRes);
    let targetObj = this.state.previewImageData;
    let data = targetObj.data;
    if (!data) {
      return;
    }
    for (let i = 0; i < data.length - 4; i += 4) { //  遍历各像素分量
      let dr = 0.393 * data[i] + 0.769 * data[i + 1] + 0.189 * data[i + 2];
      let dg = 0.349 * data[i] + 0.686 * data[i + 1] + 0.168 * data[i + 2];
      let db = 0.272 * data[i] + 0.534 * data[i + 1] + 0.131 * data[i + 2];

      let scale = Math.random() * 0.5 + 0.5;

      data[i] = scale * dr + (1 - scale) * data[i];
      scale = Math.random() * 0.5 + 0.5;
      data[i + 1] = scale * dg + (1 - scale) * data[i + 1];
      scale = Math.random() * 0.5 + 0.5;
      data[i + 2] = scale * db + (1 - scale) * data[i + 2];
    }
    this.setState({
      previewImageData: targetObj
    });
    this.putImageDataToPreview();
  }
  // 平均亮度
  averageLight() {
    this.clearImage(this.cropRes);
    let targetObj = this.state.previewImageData;
    let data = targetObj.data;
    for (let i = 0; i < data.length; i += 4) {
      let val = parseInt(data[i] * 0.21 + data[i + 1] * 0.71 + data[i + 2] * 0.07);
      data[i] = data[i + 1] = data[i + 2] = val;
    }
    this.setState({
      previewImageData: targetObj
    });
    this.putImageDataToPreview();
  }
  // 反色
  reverseRGB() {
    this.clearImage(this.cropRes);
    let targetObj = this.state.previewImageData;
    let data = targetObj.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    this.setState({
      previewImageData: targetObj
    });
    this.putImageDataToPreview();
  }
  // 黑白
  setBlack() {
    this.clearImage(this.cropRes);
    let targetObj = this.state.previewImageData;
    let data = targetObj.data;
    let grayScale = 0;
    let color = 0;
    for (let i = 0; i < data.length; i += 4) {
      grayScale = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      if (grayScale > 125) {
        color = 255;
      } else {
        color = 0;
      }
      data[i] = data[i + 1] = data[i + 2] = color;
    }
    this.setState({
      previewImageData: targetObj
    });
    this.putImageDataToPreview();
  }
  gaussBlur() {
    this.clearImage(this.cropRes);
    let imgData = this.state.previewImageData;
    let pixes = imgData.data;
    let width = imgData.width;
    let height = imgData.height;
    let gaussMatrix = [];
    let gaussSum = 0;
    let x, y, r, g, b, a, i, j, k, len;

    let radius = 30;
    let sigma = 5;

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2 * sigma * sigma);
    // 生成高斯矩阵
    for (i = 0, x = -radius; x <= radius; x++, i++) {
      g = a * Math.exp(b * x * x);
      gaussMatrix[i] = g;
      gaussSum += g;
    }
    // 归一化, 保证高斯矩阵的值在[0,1]之间
    for (i = 0, len = gaussMatrix.length; i < len; i++) {
      gaussMatrix[i] /= gaussSum;
    }
    // x 方向一维高斯运算
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        r = g = b = a = 0;
        gaussSum = 0;
        for (j = -radius; j <= radius; j++) {
          k = x + j;
          if (k >= 0 && k < width) { // 确保 k 没超出 x 的范围
            // r,g,b,a 四个一组
            i = (y * width + k) * 4;
            r += pixes[i] * gaussMatrix[j + radius];
            g += pixes[i + 1] * gaussMatrix[j + radius];
            b += pixes[i + 2] * gaussMatrix[j + radius];
            // a += pixes[i + 3] * gaussMatrix[j];
            gaussSum += gaussMatrix[j + radius];
          }
        }
        i = (y * width + x) * 4;
        // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
        // console.log(gaussSum)
        pixes[i] = r / gaussSum;
        pixes[i + 1] = g / gaussSum;
        pixes[i + 2] = b / gaussSum;
        // pixes[i + 3] = a ;
      }
    }
    // y 方向一维高斯运算
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        r = g = b = a = 0;
        gaussSum = 0;
        for (j = -radius; j <= radius; j++) {
          k = y + j;
          if (k >= 0 && k < height) { // 确保 k 没超出 y 的范围
            i = (k * width + x) * 4;
            r += pixes[i] * gaussMatrix[j + radius];
            g += pixes[i + 1] * gaussMatrix[j + radius];
            b += pixes[i + 2] * gaussMatrix[j + radius];
            // a += pixes[i + 3] * gaussMatrix[j];
            gaussSum += gaussMatrix[j + radius];
          }
        }
        i = (y * width + x) * 4;
        pixes[i] = r / gaussSum;
        pixes[i + 1] = g / gaussSum;
        pixes[i + 2] = b / gaussSum;
      }
    }
    this.setState({
      previewImageData: imgData
    });
    this.putImageDataToPreview();
  }
  relief() {
    this.clearImage(this.cropRes);
    let targetObj = this.state.previewImageData;
    let data = targetObj.data;
    let width = targetObj.width;
    for (let i = 0; i < data.length; i++) {
      if (i <= data.length - width * 4) {
        if ((i + 1) % 4 !== 0) {
          if ((i + 4) % (width * 4) === 0) {
            data[i] = data[i - 4];
            data[i + 1] = data[i - 3];
            data[i + 2] = data[i - 2];
            data[i + 3] = data[i - 1];
            i += 4;
          } else {
            data[i] = 255 / 2 + 2 * data[i] - data[i + 4] - data[i + width * 4];
          }
        }
      } else {
        if ((i + 1) % 4 !== 0) {
          data[i] = data[i - width * 4];
        }
      }
    }
    this.setState({
      previewImageData: targetObj
    });
    this.putImageDataToPreview();
  }
  // 镜像
  imageDataHRevert() {
    this.clearImage(this.cropRes);
    let targetObj = this.state.previewImageData;
    let data = targetObj.data;
    for (let i = 0, h = targetObj.height; i < h; i++) {
      for (let j = 0, w = targetObj.width; j < w; j++) {
        data[i * w * 4 + j * 4 + 0] = data[i * w * 4 + (w - j) * 4 + 0];
        data[i * w * 4 + j * 4 + 1] = data[i * w * 4 + (w - j) * 4 + 1];
        data[i * w * 4 + j * 4 + 2] = data[i * w * 4 + (w - j) * 4 + 2];
        data[i * w * 4 + j * 4 + 3] = data[i * w * 4 + (w - j) * 4 + 3];
      }
    }
    this.setState({
      previewImageData: targetObj
    });
    this.putImageDataToPreview();
  }
  render() {
    return (
      <div className="component-box">
        <div className="image-panel">
          <canvas className="source-image" ref={(canvas) => { this.canvas = canvas }}
            width={this.props.canvasWidth} height={this.props.canvasHeight}
            onWheel={(event) => this.handleMouseWheel(event)}
          ></canvas>
          <canvas ref={(canvas) => { this.template = canvas }}
            width={this.state.cropAreaWidth} height={this.state.cropAreaHeight}
            style={{ background: '#000', opacity: 0.3, position: 'absolute', left: this.state.templateX + 'px', top: this.state.templateY + 'px', border: BORDER_WIDTH + 'px dashed #fff' }}
            onMouseDown={(event) => this.handleMouseDown(event)}
            onMouseUp={(event) => this.handleMouseUp(event)}
            onMouseMove={(event) => this.handleMouseMove(event)}
          ></canvas>
        </div>
        <Templates customImage={this.props.customImage}
          getTempImages={this.getTempImages.bind(this)}
          getTemplateData={this.getTemplateData.bind(this)}
        />
        <div className="filter-box">
          <button className="set-gray" value="grayFilter" onClick={() => { this.setGray() }}>灰度滤镜</button>
          <button className="set-gray" value="grayFilter" onClick={() => { this.imageDataHRevert() }}>镜像滤镜</button>
          <button className="old-filter" value="reminiscenceFilter" onClick={() => { this.reminiscenceFilter() }}>怀旧滤镜</button>
          <button className="set-gray" value="grayFilter" onClick={() => { this.setBlack() }}>黑白滤镜</button>
          <button className="set-gray" value="grayFilter" onClick={() => { this.reverseRGB() }}>反色滤镜</button>
          <button className="set-gray" value="grayFilter" onClick={() => { this.gaussBlur() }}>模糊滤镜</button>
          <button className="set-gray" value="grayFilter" onClick={() => { this.relief() }}>浮雕滤镜</button>
        </div>
        <div className="result-preview">
          <canvas ref={(canvas) => { this.cropRes = canvas }}
            width={this.state.cropResWidth} height={this.state.cropResHeight}
          ></canvas>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  image: PropTypes.object,
  customImage: PropTypes.object,
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

// getGray(res) {
//   this.setState({
//     targetImageData: res
//   });
// }
//  <div style={{width: this.props.canvasWidth, height: this.props.canvasHeight, position: 'absolute', left: 0, top: 0, background: '#000', opacity: '0.5'}}></div>

//   <CropBox canvasWidth={this.props.canvasWidth} canvasHeight={this.props.canvasHeight}
//   canvas={this.canvas}
// ></CropBox>
//   <CropRes ref={(cropres) => { this.cropres = cropres }}
//   targetImageData={this.state.targetImageData}
//   cropAreaWidth={this.state.cropAreaWidth} cropAreaHeight={this.state.cropAreaHeight}
//   tempImageData={this.state.tempImageData} templateImgData={this.state.templateImgData}
// />
// <Filter targetImageData={this.state.targetImageData}
//         getGray={this.getGray.bind(this)}/>
