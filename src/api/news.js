import {API, API_PREFIX} from "./api";

export const getNewsTypeList = params => {
  return API.get('/api/newstype/', {
    params,
  })
};

export const createNewsType = data => {
  return API.post('/api/newstype/', data)
};

export const editNewsType = (id, data) => {
  return API.put(`/api/newstype/${id}/`, data);
};

export const deleteNewsType = id => {
  return API.delete(`/api/newstype/${id}/`);
};

export const getHelloNewsList = params => {
  return API.get('/api/hellonews/', {
    params,
  })
};

export const getHelloNewsById = id => {
  return API.get(`/api/hellonews/${id}/`);
};

export const createHelloNews = data => {
  return API.post('/api/hellonews/', data)
};

export const editHelloNews = (id, data) => {
  return API.put(`/api/hellonews/${id}/`, data);
};

export const deleteHelloNews = id => {
  return API.delete(`/api/hellonews/${id}/`);
};
