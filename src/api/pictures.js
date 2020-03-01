import {message} from "antd";

import picturesApi from "./api";


export const getGroupById = (id) => {
  return picturesApi.get(`/api/group/${id}`);
};

export const getGroups = (params) => {
  return picturesApi.get('/api/group', {
    params,
  });
};

export const getPictures = (params) => {
  return picturesApi.get("/api/pictures", {
    params
  })
};

export const getMembers = (params) => {
  return picturesApi.get('/api/member', {
    params,
  })
};


export const updateCookie = (cookie) => {
  return picturesApi.post('/api/cookie', {
    cookie
  })
};

export const refreshToken = (refreshToken) => {
  return picturesApi.post('/api/token/refresh', {
    refresh: refreshToken,
  })
};