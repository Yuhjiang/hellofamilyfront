import axios from "axios";
import {message} from "antd";
import {URL} from "../config";

const picturesApi = axios.create({
  baseURL: "http://localhost:8000/",
});

picturesApi.interceptors.request.use(config => {
  console.log(config);
  config.data = Object.assign({}, config.data, {
    authToken: window.localStorage.getItem("authToken"),
  });
  config.params = Object.assign({}, config.params, {
    format: "json",
  });
  return config;
});

picturesApi.interceptors.response.use(response => {
  if (response.status === 200) {
    return response.data;
  }
  else {
    message.error(response.data);
  }
});


export const getGroupById = (id) => {
  return picturesApi.get(`/api/group/${id}`);
};

export const getGroups = (params) => {
  return picturesApi.get('/api/group', {
    ...params,
  });
};

export const getPictures = (params) => {
  return picturesApi.get("/api/pictures", {
    ...params,
  })
};