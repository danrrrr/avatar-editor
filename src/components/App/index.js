import React from 'react';
import RaiseButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Slider from 'material-ui/Slider';
import Preview from '../Preview';
import defaultImg from './1.jpg';

import './index.scss';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: defaultImg,
      canvasWidth: 400,
      canvasHeight: 400,
      scaleValue: 1,
    };
    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleScale = this.handleScale.bind(this);
  }
  handleNewImage(e) {
    this.setState({
      image: e.target.files[0]
    });
  }
  handleScale(event, value) {
    this.setState({scaleValue: value});
  }
  handleCropImage() {
    // 获取裁剪框的位置，大小，通过drawImage绘制图片
    // const image = this.editor.getImage().toDataURL();
    // this.setState({
    //   preview: {
    //     img: image
    //   }
    // });
    this.editor.getTemplateData();
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="container">
          <Preview ref={(editor) => { this.editor = editor }}
            image={this.state.image} canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight}
            scaleValue={this.state.scaleValue}
          />
          <RaiseButton className="upload-btn" primary={true} label="choose an image">
            <input className="input-file" type="file" onChange={this.handleNewImage}></input>
          </RaiseButton>
          <RaiseButton primary={true} label="crop" onClick={() => this.handleCropImage()}></RaiseButton>
          <div className="control-panel">
            <Slider min={0.1} max={2} step={0.01} onChange={this.handleScale} value={this.state.scaleValue}/>
            <p>{this.state.scaleValue}</p>
          </div>
          {!!this.state.preview && (
            <img src={this.state.preview.img}/>
          )}
        </div>
      </MuiThemeProvider>

    );
  }
}

export default App;
