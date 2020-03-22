import newsApi from "./api";

export const getNewsTypeList = params => {
  return newsApi.get('/api/newstype/', {
    params,
  })
};

export const createNewsType = data => {
  return newsApi.post('/api/newstype/', data)
};

export const editNewsType = (id, data) => {
  return newsApi.put(`/api/newstype/${id}/`, data);
};

export const deleteNewsType = id => {
  return newsApi.delete(`/api/newstype/${id}/`);
};

export const getHelloNewsList = params => {
  return newsApi.get('/api/hellonews/', {
    params,
  })
};

export const getHelloNewsById = id => {
  return newsApi.get(`/api/hellonews/${id}/`);
};

export const createHelloNews = data => {
  return newsApi.post('/api/hellonews/', data)
};

export const editHelloNews = (id, data) => {
  return newsApi.put(`/api/hellonews/${id}/`, data);
};

export const deleteHelloNews = id => {
  return newsApi.delete(`/api/hellonews/${id}/`);
};
