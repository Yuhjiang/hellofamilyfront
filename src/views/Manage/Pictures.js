import React, {Component} from 'react';
import {Button, Card, Col, Form, Input, message, Row, Spin} from "antd";

import {updateCookie} from "../../api/pictures";


class AdminPictures extends Component {
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
      if (resp.status === 200) {
        message.success(resp.data.message);
      } else {
        message.error(resp.errMsg);
      }
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
    );
  }
}

export default AdminPictures;