import React from 'react';
import RaiseButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Preview from '../Preview';

import './index.scss';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: './1.jpg'
    };
    this.handleNewImage = this.handleNewImage.bind(this);
  }
  handleNewImage(e) {
    this.setState({
      image: e.target.files[0]
    });
    console.log(this.state.image);
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="container">
          <Preview image={this.state.image} />
          <RaiseButton className="upload-btn" primary={true} label="choose an image">
            <input className="input-file" type="file" onChange={this.handleNewImage}></input>
          </RaiseButton>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
