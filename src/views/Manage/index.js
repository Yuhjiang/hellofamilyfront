// 管理图片库功能：
// 1. 增加人脸
// 2. 更新Cookie
import React, {Component} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import {Menu, Dropdown, Row, Col} from "antd";
import {PictureOutlined, DownOutlined} from "@ant-design/icons";

import {
  adminRouter,
  helloProjectManage,
  adminSubMenus,
  articleManage,
  userManage,
  commonManage
} from "../../routes";

const adminMenus = adminRouter.filter(item => !item.root);

const layout = {
  xs: 6, sm: 6, md: 6, lg: 6
};

class Manage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      current: "/manage/pictures",
    }
  }


  handleOnMenuClick = e => {
    this.setState({
      current: e.key,
    });
    this.props.history.push(e.key);
  };

  helloProjectMenu = (<Menu
    onClick={this.handleOnMenuClick}
  >
    {helloProjectManage.map(route => {
      return (
        <Menu.Item key={route.pathname}>{route.title}</Menu.Item>
      )
    })}
  </Menu>);


  render() {
    return (
      <>
        {/*<Menu*/}
        {/*  onClick={this.handleOnMenuClick}*/}
        {/*  selectedKeys={this.props.location.pathname} mode="horizontal"*/}
        {/*>*/}
        {/*  {adminMenus.map(route => {*/}
        {/*    return (<Menu.Item key={route.pathname}>{route.title}</Menu.Item>)*/}
        {/*  })}*/}
        {/*</Menu>*/}
        <Row style={{
          backgroundColor: "#fff",
          height: 40,
          padding: "0 20px 0 20px",
          fontSize: "1.2em"
        }}
             align="middle"
        >
          {adminSubMenus.map(subMenu => {
            const menus = (<Menu
              onClick={this.handleOnMenuClick}
            >
              {subMenu.routers.map(route => {
                return (
                  <Menu.Item key={route.pathname}>{route.title}</Menu.Item>
                )
              })}
            </Menu>);
            return (
              <Col {...layout}>
                <Dropdown overlay={menus}>
                  <span><subMenu.logo /><span>{subMenu.title}</span><DownOutlined/></span>
                </Dropdown>
              </Col>
            )
          })}
        </Row>
        <Switch>
          {adminMenus.map((route, idx) => {
            return (<Route key={idx} path={route.pathname} component={route.component}/>)
          })}
          <Redirect to="/manage/pictures" from="/manage" exact={true}/>
        </Switch>
      </>
    );
  }
}

export default Manage;