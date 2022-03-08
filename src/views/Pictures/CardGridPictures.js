import React, {Component} from 'react';
import {Card, List, message, Popconfirm} from "antd";
import PropTypes from "prop-types";
import {recognizePicture} from "../../api/pictures";

class CardGridPictures extends Component {
  static propTypes = {
    pictures: PropTypes.array.isRequired,
  };

  handleOnRecognizePicture = id => {
    recognizePicture({id: id}).then(resp => {
      if (resp.error === 200) {
        let msg = ''
        for (let i = 0; i < resp.members.length; i++) {
          msg = msg + resp.members[i]
          if (i < resp.members.length - 1) {
            msg = msg + ', '
          }
        }
        message.success('成功识别出: ' + msg)
      }
      else {
        message.error("没有识别出成员");
      }
    }).catch(err => {
      message.error("出现不可知错误");
    })
  };

  render() {
    return (
      <List
        grid={{
          gutter: 16,
          column: 4,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xll: 4
        }}
        style={{backgroundColor: "#fff", padding: 10, width: "100%"}}
        dataSource={this.props.pictures}
        renderItem={item => (
          <List.Item>
            <Popconfirm
              title="确定要更新人脸信息吗"
              onConfirm={this.handleOnRecognizePicture.bind(this, item.id)}
              okText="确认"
              cancelText="取消"
            >
              <Card bordered={false} hoverable bodyStyle={{padding: 0}}>
                <div
                  style={{
                    display: "block",
                    width: "100%",
                    height: 0,
                    paddingBottom: "80%",
                    overflow: "hidden"
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `<a href=${item.url} target="_blank"><img src=${item.url} alt=${item.name} 
                     style="max-width:100%;display:block;"/></a>`
                  }}
                >
                </div>
              </Card>
            </Popconfirm>
          </List.Item>
        )}
      />
    );
  }
}


export default CardGridPictures;