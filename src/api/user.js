import axios from "axios";
import {message} from "antd";
import {URL} from "../config";

const userApi = axios.create({
  baseURL: URL,
  timeout: 3000,
});

userApi.interceptors.request.use(config => {
  config.params = Object.assign({}, config.params, {
    format: "json",
  });
  return config;
});

userApi.interceptors.response.use(response => {
  if (response.status === 200) {
    return response.data.data;
  }
  else {
    message.error(response.data);
  }
});

export const loginUser = (userInfo) => {
  return userApi.post('/api/login', userInfo);
};