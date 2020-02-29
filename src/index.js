import React from "react";
import {render} from "react-dom";
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import {ConfigProvider} from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import {Provider} from "react-redux";

import App from "./App";
import {store} from "./store";
import {basicRouter} from "./routes";

render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <Router>
        <Switch>
          {basicRouter.map((route, idx) => {
            console.log(route);
            return (
              <Route
                path={route.pathname}
                key={idx}
                component={route.component}
                exact
              />
            )
          })}
          <Route path="/" render={(routeProps => {
            return (<App {...routeProps} />)
          })}/>
          <Redirect to="/404"/>
        </Switch>
      </Router>
    </ConfigProvider>
  </Provider>,
  document.querySelector("#root"),
);
