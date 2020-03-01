import React, {Component} from 'react';
import {Timeline, Spin, Card} from "antd";
import moment from "moment";

import {getGroups} from "../../api";
import Image from "../../components/Image";


class TimelinePictures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({
      isLoading: true,
    });

    getGroups().then(resp => {
      this.setState({
        groups: resp.groups
      })
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  render() {
    return (
      <Spin spinning={this.state.isLoading}>
        <Card>
          <Timeline mode="alternate" style={{paddingTop: 20}}>
            {this.state.groups.map((item, idx) => {
              return (
                <Timeline.Item key={idx}>
                  <div><b>{item.name_jp}</b></div>
                  <div>{moment(item.created_time).locale("zh-cn").format("LL")}</div>
                  <Image style={{display: "block"}} src={item.favicon}
                         alt={item.name_jp}/>
                </Timeline.Item>
              )
            })}
          </Timeline>
        </Card>
      </Spin>
    );
  }
}

export default TimelinePictures;