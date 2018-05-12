import React from 'react';
import RaiseButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Preview from '../Preview';
import defaultImg from './1.jpg';

import './index.scss';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: defaultImg,
      canvasWidth: 400,
      canvasHeight: 400
    };
    this.handleNewImage = this.handleNewImage.bind(this);
  }
  handleNewImage(e) {
    this.setState({
      image: e.target.files[0]
    });
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="container">
          <Preview image={this.state.image} canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight}/>
          <RaiseButton className="upload-btn" primary={true} label="choose an image">
            <input className="input-file" type="file" onChange={this.handleNewImage}></input>
          </RaiseButton>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
