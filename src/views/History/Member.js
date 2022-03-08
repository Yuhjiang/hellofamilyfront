import {getMemberHistory} from "../../api/pictures";
import {Card, Col, message, Row, Spin, Timeline} from "antd";
import React, {Component} from "react";
import moment from "moment";

class MemberHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    this.setState({
      isLoading: true
    })
    getMemberHistory().then(resp => {
      this.setState({
        members: resp
      })
    }).catch(err => {
      message.error("获取失败")
    }).finally(() => {
      this.setState({
        isLoading: false
      })
    })
  }

  render() {
    const colStyle = {
      lg: 12,
      md: 12,
      sm: 24,
      xs: 24,
    };
    return (
      <Spin spinning={this.state.isLoading}>
        <Card>
          <Timeline mode="alternate" style={{marginTop: 20, width: "100%"}}>
            {this.state.members.map((item, idx) => {
              return (
                <Timeline.Item key={idx}>
                  <div>{moment(item.joined_time).format("LL")}</div>
                  <Row justify={idx % 2 ? "end" : "start"}>
                    {item.members.map((item, idx) => (
                      <Col {...colStyle}>
                        <Card bordered={false} hoverable bodyStyle={{padding: 5}}
                        title={item.name_jp}>
                          <div
                            style={{
                              display: "block",
                              width: "100%",
                              height: 0,
                              paddingBottom: "80%",
                              overflow: "hidden"
                            }}
                            key={idx}
                            dangerouslySetInnerHTML={{
                              __html: `<a href=${item.favicon} target="_blank"><img src=${item.favicon} alt=${item.name_jp} 
                     style="max-width:100%;display:block;"/></a>`
                            }}
                          >
                          </div>
                        </Card>
                      </Col>)
                    )}
                  </Row>
                </Timeline.Item>
              )
            })}
          </Timeline>
        </Card>
      </Spin>
    );
  }
}


export default MemberHistory
