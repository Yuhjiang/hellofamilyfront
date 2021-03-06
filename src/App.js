import React, {Component} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import {connect} from "react-redux";

import Frame from "./components/Frame";
import {mainRouter, adminRouter} from "./routes";

// 在顶部导航栏的路由
const menus = mainRouter.filter(item => item.isNav);
const adminMenus = adminRouter.filter(item => item.root);

// redux状态
const mapStateToProps = state => {
  return {
    isLogin: state.user.isLogin,
    isAdmin: state.user.isAdmin,
  }
};

@connect(mapStateToProps, )
class App extends Component {
  render() {
    // 管理员权限的用户增加管理页面
    const newMenus = menus.concat(this.props.isAdmin ? adminMenus : []);
    return (
      <Frame menus={newMenus}>
        <Switch>
          {
            mainRouter.map((route, idx) => {
              return (
                <Route
                  key={idx}
                  path={route.pathname}
                  exact={route.exact}
                  render={routeProps => {
                    return (<route.component {...routeProps} />)
                   }
                  }
                />
              )
            })
          }
          {
            this.props.isAdmin
            ?
              adminRouter.map((route, idx) => {
                return (
                  <Route
                    key={idx}
                    path={route.pathname}
                    render={routeProps => {
                      return (<route.component {...routeProps} />)
                    }}
                  />
                )
              })
              :
              ""
          }
          <Redirect to="/pictures" from="/" exact />
          <Redirect to="/404"/>
        </Switch>
      </Frame>
    );
  }
}

export default App;