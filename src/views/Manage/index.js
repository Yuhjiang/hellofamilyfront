// 管理图片库功能：
// 1. 增加人脸
// 2. 更新Cookie
import React, {Component} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import {Menu} from "antd";

import {adminRouter} from "../../routes";

const adminMenus = adminRouter.filter(item => !item.root);


class Manage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      current: "/admin/pictures",
    }
  }


  handleOnMenuClick = e => {
    this.setState({
      current: e.key,
    });
    this.props.history.push(e.key);
  };


  render() {
    console.log(this.props);
    return (
      <>
        <Menu
          onClick={this.handleOnMenuClick}
          selectedKeys={this.props.location.pathname} mode="horizontal"
        >
          {adminMenus.map(route => {
            return (<Menu.Item key={route.pathname}>{route.title}</Menu.Item>)
          })}
        </Menu>
        <Switch>
          {adminMenus.map((route, idx) => {
            return (<Route key={idx} path={route.pathname} component={route.component} />)
          })}
          <Redirect to="/admin/pictures" from="/admin" exact={true}/>
        </Switch>
      </>
    );
  }
}

export default Manage;