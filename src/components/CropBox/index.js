import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const INIT_SIZE = 200;
const BORDER_WIDTH = 2;

class CropBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initCropAreaWidth: INIT_SIZE,
      initCropAreaHeight: INIT_SIZE,
      cropAreaWidth: INIT_SIZE,
      cropAreaHeight: INIT_SIZE,
      scaleValue: 1,
      templateX: 0,
      templateY: 0,
    };
  }

  getElementClient(ele) {
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(ele).getBoundingClientRect();
  }

  handleMouseDown(e) {
    e.preventDefault();
    console.log(this.props.canvas);
    const canvasObj = this.getElementClient(this.props.canvas);
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

  render() {
    return (
      <div>
        <canvas ref={(canvas) => { this.template = canvas }}
          width={this.state.cropAreaWidth} height={this.state.cropAreaHeight}
          style={{ background: '#000', opacity: 0.3, position: 'absolute', left: this.state.templateX + 'px', top: this.state.templateY + 'px', border: BORDER_WIDTH + 'px dashed #fff' }}
          onMouseDown={(event) => this.handleMouseDown(event)}
          onMouseUp={(event) => this.handleMouseUp(event)}
          onMouseMove={(event) => this.handleMouseMove(event)}
        ></canvas>
      </div>
    );
  }
}

CropBox.propTypes = {
  canvasWidth: PropTypes.number,
  canvasHeight: PropTypes.number,
  canvas: PropTypes.object,
};

export default CropBox;
