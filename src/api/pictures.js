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

export const registerMemberFace = (data) => {
  return picturesApi.post('/api/face', data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getCarouselList = params => {
  return picturesApi.get('/api/carousel', {params});
};

export const editCarousel = (id, data) => {
  return picturesApi.put(`/api/carousel/${id}/`, data);
};

export const deleteCarousel = id => {
  return picturesApi.delete(`/api/carousel/${id}/`);
};

export const createCarousel = data => {
  return picturesApi.post('/api/carousel/', data);
};