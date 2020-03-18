import React, {Component} from 'react';
import {
  Timeline, Row, Col, Card
} from "antd";
import PropTypes from "prop-types";
import moment from "moment";

class TimelinePicture extends Component {
  static propTypes = {
    pictures: PropTypes.array.isRequired,
  };

  render() {
    const colStyle = {
      lg: 12,
      md: 12,
      sm: 24,
      xs: 24,
    };
    return (
      <Timeline mode="alternate" style={{marginTop: 20}}>
        {this.props.pictures.map((item, idx) => {
          return (
            <Timeline.Item key={item._id}>
              <div>{moment(item._id).format("LL")}</div>
              <Row justify={idx % 2 ? "end" : "start"}>
                {item.pictures.map((item, idx) => (
                  <Col {...colStyle}>
                    <Card bordered={false} hoverable bodyStyle={{padding: 5}}>
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
                        __html: `<a href=${item.url} target="_blank"><img src=${item.url} alt=${item.name} 
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
    );
  }
}

export default TimelinePicture;