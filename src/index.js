import React from "react";
import {render} from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";
import {ConfigProvider} from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";

import App from "./App";

render(
  <ConfigProvider locale={zhCN}>
    <Router>
      <App/>
    </Router>
  </ConfigProvider>,
  document.querySelector("#root"),
);
