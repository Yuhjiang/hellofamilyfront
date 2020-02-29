import React, {Component} from 'react';
import {Spin} from "antd";

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  handleOnLoad = () => {
    this.setState({
      isLoading: false
    })
  };

  render() {
    const {
      style = {},
      ...props
    } = this.props;
    return (
      <Spin spinning={this.state.isLoading}>
        <div style={style} className="picture">
          <img {...props} onLoad={this.handleOnLoad}/>
        </div>
      </Spin>
    );
  }
}

export default Image;