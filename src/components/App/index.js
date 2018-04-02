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
  render() {
    return (
      <MuiThemeProvider>
        <div className="container">
          <Preview image={this.state.image} canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight}
            scaleValue={this.state.scaleValue}/>
          <RaiseButton className="upload-btn" primary={true} label="choose an image">
            <input className="input-file" type="file" onChange={this.handleNewImage}></input>
          </RaiseButton>
          <div className="control-panel">
            <Slider min={0.1} max={2} step={0.01} onChange={this.handleScale} value={this.state.scaleValue}/>
            <p>{this.state.scaleValue}</p>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
