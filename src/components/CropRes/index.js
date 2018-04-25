import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const INIT_SIZE = 200;
class CropRes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cropResWidth: INIT_SIZE,
      cropResHeight: INIT_SIZE,
    };
  }

  putImageDataToPreview() {
    if (!this.props.targetImageData) {
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = this.props.cropAreaWidth;
    canvas.height = this.props.cropAreaHeight;
    const ctx = canvas.getContext('2d');
    // eslint-disable-next-line react/no-find-dom-node
    const resCtx = ReactDOM.findDOMNode(this.cropRes).getContext('2d');

    let previewImage = ctx.getImageData(0, 0, this.props.cropAreaWidth, this.props.cropAreaHeight);
    let previewData = previewImage.data;
    const tempImageData = this.props.templateImgData;
    if (!tempImageData) {
      return;
    }
    const targetImageData = this.props.targetImageData;
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

  render() {
    return (
      <div>
        <canvas ref={(canvas) => { this.cropRes = canvas }}
          width={this.state.cropResWidth} height={this.state.cropResHeight}
          style={{ background: '#fff', opacity: 1 }}
        ></canvas>
      </div>
    );
  }
}

CropRes.propTypes = {
  targetImageData: PropTypes.array,
  cropAreaWidth: PropTypes.number,
  cropAreaHeight: PropTypes.number,
  tempImageData: PropTypes.array,
  templateImgData: PropTypes.array,
};

export default CropRes;
