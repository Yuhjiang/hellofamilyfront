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

export const uploadPicture = (data) => {
  return articlesApi.post('/api/upload_picture', data, {
    headers: {"Content-Type": "multipart/form-data"}
  });
};

export const postArticle = (data) => {
  return articlesApi.post('/api/post/', data);
};

export const postCategory = (data) => {
  return articlesApi.post('/api/category/', data);
};

export const editCategory = (id, data) => {
  return articlesApi.put(`/api/category/${id}/`, data);
};