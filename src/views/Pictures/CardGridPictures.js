import React, {Component} from 'react';
import {Card, List, message, Popconfirm} from "antd";
import PropTypes from "prop-types";
import {recognizePicture} from "../../api/pictures";

class CardGridPictures extends Component {
  static propTypes = {
    pictures: PropTypes.array.isRequired,
  };

  handleOnRecognizePicture = picture => {
    recognizePicture({pictureName: picture}).then(resp => {
      message.info("请稍等片刻");
    }).catch(err => {
      message.error("出现不可知错误");
    })
  };

  render() {
    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
        }}
        style={{backgroundColor: "#fff", padding: 10}}
        dataSource={this.props.pictures}
        renderItem={item => (
          <List.Item>
            <Popconfirm
              title="确定要更新人脸信息吗"
              onConfirm={this.handleOnRecognizePicture.bind(this, item.name)}
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