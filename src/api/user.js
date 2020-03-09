import axios from "axios";
import {message} from "antd";
import {URL} from "../config";
import user from "../reducers/user";

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
    return response.data;
  }
  else {
    message.error(response.data);
  }
});

export const loginUser = userInfo => {
  return userApi.post('/api/login', userInfo);
};

export const registerUser = userInfo => {
  return userApi.post('/api/register', userInfo);
};

export const getUserById = id => {
  return userApi.get(`/api/user/${id}/`);
};

export const updateUserById = (id, data) => {
  return userApi.put(`/api/user/${id}/`, data);
}