import React, {Component} from 'react';
import {Card, Button} from "antd";

import HelloTimeline from "./HelloTimeline";
import HelloNews from "./HelloNews";


class TimelineActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsOrTimeline: true,
    }
  }

  handleViewChange = () => {
    this.setState(state => {
        return {
          newsOrTimeline: !state.newsOrTimeline,
        }
      })
  };

  render() {
    return (
      <Card
        title="资讯列表"
        bordered={false}
        extra={
          <Button
            onClick={this.handleViewChange}>
            {this.state.newsOrTimeline ? "切换成时间线" : "切换成默认"}
          </Button>
        }
      >
        {this.state.newsOrTimeline ? <HelloNews /> : <HelloTimeline />}
      </Card>
    )
  }
}

export default TimelineActivity;