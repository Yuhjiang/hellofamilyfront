// 页面主要框架，导航栏，侧边栏，页脚等组件
import React, {Component} from 'react';
import {Layout, Menu} from "antd";

import logo from "./hellofamily.png";
import "./frame.less";

const {Header, Content, Footer, Sider} = Layout;

class Frame extends Component {
  render() {
    return (
      <>
        <Layout>
          <Header style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            backgroundColor: "#fff",
            padding: 0
          }}>
            <div className="logo">
              <img src={logo} alt="hellofamily.club logo"/>
            </div>
            <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{lineHeight: '64px'}}
            >
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Layout style={{marginTop: 80}}>
            <Content style={{backgroundColor: "#fff"}}>
              {this.props.children}
            </Content>
            <Sider style={{backgroundColor: "#fff", marginLeft: "20px"}}>
              {"hello"}
            </Sider>
          </Layout>
          <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant
            UED</Footer>
        </Layout>,
      </>
    );
  }
}

export default Frame;