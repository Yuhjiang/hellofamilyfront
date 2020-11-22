import {API, API_PREFIX} from "./api";

const PREFIX = API_PREFIX + "news"

export const getNewsTypeList = params => {
  return API.get(`${PREFIX}/type/`, {
    params,
  })
};

export const createNewsType = data => {
  return API.post(`${PREFIX}/type/`, data)
};

export const editNewsType = (id, data) => {
  return API.put(`${PREFIX}/type/${id}/`, data);
};

export const deleteNewsType = id => {
  return API.delete(`${PREFIX}/type/${id}/`);
};

export const getHelloNewsList = params => {
  return API.get(`${PREFIX}/`, {
    params,
  })
};

export const getHelloNewsById = id => {
  return API.get(`${PREFIX}/${id}/`);
};

export const createHelloNews = data => {
  return API.post(`${PREFIX}/`, data)
};

export const editHelloNews = (id, data) => {
  return API.put(`${PREFIX}/${id}/`, data);
};

export const deleteHelloNews = id => {
  return API.delete(`${PREFIX}/${id}/`);
};
