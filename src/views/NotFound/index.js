import React, {Component} from 'react';
import {Card} from "antd";

import notFound from "./404.png";

class NotFound extends Component {
  render() {
    return (
      <Card title="你访问的页面不见惹">
        <img src={notFound} alt="你访问的页面不见了" style={{width: "100%"}}/>
      </Card>
    );
  }
}

export default NotFound;