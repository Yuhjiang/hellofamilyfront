import axios from "axios";
import {message} from "antd";
import {URL} from "../config";

import userApi from "./api";

const userLoginOrRegister = axios.create({
  baseURL: URL,
  timeout: 3000,
});

userLoginOrRegister.interceptors.request.use(config => {
  config.params = Object.assign({}, config.params, {
    format: "json",
  });
  return config;
});

userLoginOrRegister.interceptors.response.use(response => {
  if (response.status === 200) {
    return response.data;
  }
  else {
    message.error(response.data);
  }
});

export const loginUser = userInfo => {
  return userLoginOrRegister.post('/api/login', userInfo);
};

export const registerUser = userInfo => {
  return userLoginOrRegister.post('/api/register', userInfo);
};

export const getUserById = id => {
  return userApi.get(`/api/user/${id}/`);
};

export const updateUserById = (id, data) => {
  return userApi.put(`/api/user/${id}/`, data);
};

export const getUserList = params => {
  return userApi.get('/api/user/', {params})
};

export const deleteUserById = id => {
  return userApi.delete(`/api/user/${id}`);
};
