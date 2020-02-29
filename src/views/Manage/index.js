// 管理图片库功能：
// 1. 增加人脸
// 2. 更新Cookie
import React, {Component} from 'react';
import {Card, Form, Row, Col, Input, Button, Spin, message} from "antd";

import {updateCookie} from "../../api/pictures";

class Manage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    }
  }

  onFinish = values => {
    this.setState({
      isLoading: true,
    });
    updateCookie(values.updateCookie).then(resp => {
      message.success(resp.message);
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
      <>
        <Card title="更新Cookie">
          <Spin spinning={this.state.isLoading}>
            <Form name="update_cookie" onFinish={this.onFinish}>
              <Row>
                <Col span={20}>
                  <Form.Item
                    label="更新Cookie"
                    name="updateCookie"
                    rules={[{required: true, message: "请输入Cookie"}]}
                    wrapperCol={{span: 20}}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit"
                            style={{float: "right"}}>
                      提交
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>
      </>
    );
  }
}

export default Manage;