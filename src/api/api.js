import axios from "axios";
import {message} from "antd";

import {URL} from "../config";
import {clearTokensAndUserInfo} from "../utils";

const API_PREFIX = "/api/v1/";

const API = axios.create({
  baseURL: URL,
  timeout: 300000,
});

API.interceptors.request.use(config => {
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

API.interceptors.response.use(response => {
  if (response.status === 200 || response.status === 201 || response.status === 204) {
    if (response.data.status === 302) {
      setTimeout(() => {window.location=response.data.data.url}, 2000);
      return Promise.reject(response.data);
    }
    else if (response.data.status === 500) {
      return Promise.reject(response.data);
    }
    else {
      return response.data;
    }
  }
  else {
    message.error(response.data);
  }
}, error => {
  if (error.response.status === 401) {
    // token过期，重新更新cookie
    if (!error.response.data.messages) {
      clearTokensAndUserInfo();
      setTimeout(() => {window.location='/login'}, 2000);
      message.warn("未登录用户禁止操作，请重新登录");
    }
    else {
      setAuthToken();
      window.location.reload();
      message.info("请重新执行操作");
    }
  }
  else {
    return Promise.reject(error.response.data);
  }
});


export const refreshToken = (refreshToken) => {
  return API.post('/api/token/refresh', {
    refresh: refreshToken,
  })
};


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

export {API, API_PREFIX};