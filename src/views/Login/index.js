import React, {Component} from 'react';
import {Card, Form, Input, Checkbox, Button, Spin} from "antd";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";

import {login} from "../../actions/user";
import "./login.less";

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 8},
};
const tailLayout = {
  wrapperCol: {offset: 8, span: 8},
};

const mapStateToProps = state => {
  return {
    isLogin: state.user.isLogin,
    isLoading: state.user.isLoading,
  }
};


@connect(mapStateToProps, {login})
class Login extends Component {
  onFinish = values => {
    this.props.login(values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    return (
      this.props.isLogin
        ?
        <Redirect to="/"/>
        :
        <Card bordered={false} className="hf-login-form">
          <Spin spinning={this.props.isLoading}>
            <Form
              {...layout}
              name="basic"
              initialValues={{remember: true}}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{
                  required: true,
                  message: 'Please input your username!'
                }]}
              >
                <Input/>
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{
                  required: true,
                  message: 'Please input your password!'
                }]}
              >
                <Input.Password/>
              </Form.Item>

              <Form.Item {...tailLayout} name="remember"
                         valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
    );
  }
}

export default Login;
