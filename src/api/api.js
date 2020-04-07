import axios from "axios";
import {message} from "antd";

import {URL} from "../config";
import {refreshToken} from "./pictures";

const Api = axios.create({
  baseURL: URL,
  timeout: 30000,
});

Api.interceptors.request.use(config => {
  if (config.method !== 'get') {
    config.headers = {
      ...config.headers,
      'Authorization': window.localStorage.getItem("authToken") || window.sessionStorage.getItem("authToken"),
    };
  }
  return config;
}, error => {
  message.error("操作失败");
});

Api.interceptors.response.use(response => {
  if (response.status === 200 || response.status === 201 || response.status === 204) {
    if (response.data.status === 302) {
      console.log(response.data);
      setTimeout(() => {window.location=response.data.data.url}, 2000);
      return Promise.reject(response.data.errMsg);
    }
    else if (response.data.status === 500) {
      return Promise.reject(response.data.errMsg);
    }
    else {
      return response.data;
    }
  }
  else {
    message.error(response.data.errMsg);
  }
}, error => {
  if (error.response.status === 401) {
    // token过期，重新更新cookie
    setAuthToken();
  }
  else {
    return Promise.reject(error);
  }
});


const setAuthToken = () => {
  // 更新token
  if (window.localStorage.getItem("refreshToken")) {
    // 补充token的前缀信息
    refreshToken(window.localStorage.getItem("refreshToken")).then(resp => {
      window.localStorage.setItem("authToken", "HelloFamily " + resp.access)
      }
    )
  } else {
    refreshToken(window.sessionStorage.getItem("refreshToken")).then(resp => {
        window.sessionStorage.setItem("authToken", "HelloFamily " + resp.access)
      }
    )
  }
};

export default Api;