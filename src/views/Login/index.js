import React, {Component} from 'react';
import {Card, Form, Input, Checkbox, Button, Spin, Tabs, Col, Row, Carousel, message} from "antd";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";

import {login} from "../../actions/user";
import "./login.less";
import {registerUser} from "../../api/user";

const {TabPane} = Tabs;

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};
const tailLayout = {
  wrapperCol: {offset: 10, span: 8},
};

const mapStateToProps = state => {
  return {
    isLogin: state.user.isLogin,
    isLoading: state.user.isLoading,
  }
};


@connect(mapStateToProps, {login})
class UserLoginOrRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: "1",
      isLoading: false,
    }
  }

  handleOnRegister = data => {
    console.log(data);
    this.setState({
      isLoading: true,
    });
    registerUser(data).then(resp => {
      message.success("成功注册");
      this.setState({
        selectedKey: "1",
      })
    }).catch(err => {
      message.error("注册失败")
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  onTabChange = key => {
    this.setState({
      selectedKey: key,
    })
  };

  render() {
    return (
      this.props.isLogin
        ?
        <Redirect to="/"/>
        :
        <>
          <Row style={{marginTop: 200, marginLeft: "10%"}}>
            <Col span={16} style={{maxWidth: 960}}>
              <Carousel autoplay>
                <div style={{width: "100%"}}>
                  <img
                    style={{margin: "auto"}}
                    src="http://cdn.helloproject.com/img/rotation/6611cc430ab66053e0a5bffe896eba2a89374036.jpg"
                  />
                </div>
                <div>
                  <img
                    style={{margin: "auto"}}
                    src="http://cdn.helloproject.com/img/rotation/81d37572be4c71a961219bf86eee662b5b33a4dd.jpg"
                  />
                </div>
              </Carousel>
            </Col>
            <Col span={6} style={{backgroundColor: "#fff"}}>
              <Tabs activeKey={this.state.selectedKey} onChange={this.onTabChange} type="card">
                <TabPane tab="登录" key="1">
                  <Login/>
                </TabPane>
                <TabPane tab="注册" key="2">
                  <Register isLoading={this.state.isLoading} register={this.handleOnRegister}/>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </>
    )
  }
}

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
      <Spin spinning={this.props.isLoading}>
        <Form
          name="basic"
          initialValues={{remember: true}}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          {...layout}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{
              required: true,
              message: '请输入你的用户名!'
            }]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{
              required: true,
              message: '请输入你的密码!'
            }]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item name="remember"
                     valuePropName="checked"
                     {...tailLayout}
          >
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item
            {...tailLayout}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

class Register extends Component {
  onFinish = values => {
    console.log(123);
    this.props.register(values);
  };

  onFinishFailed = error => {
    message.error("请检查输入是否合规");
  };

  render() {
    return (
      <Spin spinning={this.props.isLoading}>
        <Form
          name="basic"
          initialValues={{remember: true}}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          {...layout}
        >
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{
              required: true,
              message: "请输入你的昵称!"
            }]}
          >
            <Input autoComplete="off"/>
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              {
                required: true,
                message: "请输入你的邮箱!"
              },
              {
                type: "email",
                message: "你输入的邮箱格式不对！"
              }
            ]}
          >
            <Input autoComplete="off"/>
          </Form.Item>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{
              required: true,
              message: '请输入你的用户名!'
            }]}
          >
            <Input autoComplete="off"/>
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{
              required: true,
              message: '请输入你的密码!'
            }]}
          >
            <Input.Password autoComplete="new-password"/>
          </Form.Item>
          <Form.Item
            {...tailLayout}
          >
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

export default UserLoginOrRegister;
