import axios from "axios";

import articlesApi from "./api";
import {URL} from "../config";

// const uploadApi = axios.create({
//   baseURL: URL,
//   timeout: 3000,
//   headers: {
//     "Content-Type": "multipart/form-data",
//   }
// });
//
// uploadApi.interceptors.request.use(config => {
//   if (config.method !== 'get') {
//     config.headers = {
//       ...config.headers,
//       'Authorization': window.localStorage.getItem("authToken") || window.sessionStorage.getItem("authToken"),
//     };
//   }
//   return config;
// });

export const getArticleList = (params) => {
  return articlesApi.get('/api/post/', params)
};


export const getArticleById = (id) => {
  return articlesApi.get(`/api/post/${id}`)
};

export const getCategoryList = (params) => {
  return articlesApi.get('/api/category/', params);
};

export const getTagList = (params) => {
  return articlesApi.get('/api/tag/', params);
};

export const updatePicture = (data) => {
  return articlesApi.post('/api/upload_picture', data, {
    headers: {"Content-Type": "multipart/form-data"}
  });
};