import React, {Component} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";

import Frame from "./components/Frame";
import {mainRouter} from "./routes";

class App extends Component {
  render() {
    return (
      <Frame>
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
                    console.log(route.component);
                    return (<route.component {...routeProps} />)
                   }
                  }
                />
              )
            })
          }
          <Redirect to="/404"/>
        </Switch>
        {/*<Pictures />*/}
      </Frame>
    );
  }
}

export default App;