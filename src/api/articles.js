import articlesApi from "./api";


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