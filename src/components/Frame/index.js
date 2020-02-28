// 页面主要框架，导航栏，侧边栏，页脚等组件
import React, {Component} from 'react';
import {Layout, Menu} from "antd";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

import logo from "./hellofamily.png";
import "./frame.less";

const {Header, Content, Footer, Sider} = Layout;

@withRouter
class Frame extends Component {
  static propTypes = {
    menus: PropTypes.array,
  };

  handleOnMenuClick = ({key}) => {
    this.props.history.push(key);
  };

  render() {
    return (
      <>
        <Layout>
          <Header style={{
            position: 'fixed',
            zIndex: 10,
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
              onClick={this.handleOnMenuClick}
            >
              {this.props.menus.map(item => {
                return (
                  <Menu.Item key={item.pathname}>
                    {item.title}
                  </Menu.Item>
                )
              })}
            </Menu>
          </Header>
          <Layout style={{marginTop: 80}}>
            <Content style={{backgroundColor: "#fff"}}>
              {this.props.children}
            </Content>
            <Sider
              breakpoint="lg"
              collapsedWidth="0"
              theme="light"
              style={{marginLeft: 20}}
              width={330}
            >
              <div className="logo"/>
              <Menu theme="light" mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="1">
                  <span className="nav-text">nav 1</span>
                </Menu.Item>
                <Menu.Item key="2">
                  <span className="nav-text">nav 2</span>
                </Menu.Item>
                <Menu.Item key="3">
                  <span className="nav-text">nav 3</span>
                </Menu.Item>
                {/*<Menu.Item key="4" style={{height: 400}}>*/}
                {/*  <div dangerouslySetInnerHTML={{__html: '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=280 height=400 src="//music.163.com/outchain/player?type=1&id=85470455&auto=0&height=430"></iframe>'}}*/}
                {/*       />*/}
                {/*</Menu.Item>*/}
              </Menu>
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