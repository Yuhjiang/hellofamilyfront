import React, {Component} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import {connect} from "react-redux";

import Frame from "./components/Frame";
import {mainRouter} from "./routes";

// 在顶部导航栏的路由
const menus = mainRouter.filter(item => item.isNav);

// redux状态
const mapStateToProps = state => {
  console.log(state);
  return {
    isLogin: state.user.isLogin
  }
};

@connect(mapStateToProps, )
class App extends Component {
  render() {
    return (
      <Frame menus={menus}>
        <Switch>
          {
            mainRouter.map((route, idx) => {
              console.log(route);
              return (
                <Route
                  key={idx}
                  path={route.pathname}
                  excat={route.exact}
                  render={routeProps => {
                    return (<route.component {...routeProps} />)
                   }
                  }
                />
              )
            })
          }
          <Redirect to="/pictures" from="/" exact />
          <Redirect to="/404"/>
        </Switch>
      </Frame>
    );
  }
}

export default App;