import React, {Component} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";

import Frame from "./components/Frame";
import {mainRouter} from "./routes";

// 在顶部导航栏的路由
const menus = mainRouter.filter(item => item.isNav);

class App extends Component {
  render() {
    return (
      <Frame menus={menus}>
        <Switch>
          {
            mainRouter.map((route, idx) => {
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
          <Redirect to="/404"/>
        </Switch>
      </Frame>
    );
  }
}

export default App;