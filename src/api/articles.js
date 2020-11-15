import {API, API_PREFIX} from "./api";


export const getArticleList = params => {
  return API.get('/api/post/', {params})
};


export const getArticleById = id => {
  return API.get(`/api/post/${id}/`)
};

export const deleteArticle = id => {
  return API.delete(`/api/post/${id}/`)
};

export const updateArticleAuto = (id, data) => {
  // 自动保存的文章存为草稿
  data.status = 2;
  return API.put(`/api/post/${id}/`, data);
};

export const updateArticle = (id, data) => {
  data.status = 1;
  return API.put(`/api/post/${id}/`, data);
};

export const uploadPicture = data => {
  return API.post('/api/upload_picture', data, {
    headers: {"Content-Type": "multipart/form-data"}
  });
};

export const postArticle = data => {
  return API.post('/api/post/', data);
};

export const getCategoryList = params => {
  return API.get('/api/category/', {params});
};

export const postCategory = data => {
  return API.post('/api/category/', data);
};

export const editCategory = (id, data) => {
  return API.put(`/api/category/${id}/`, data);
};

export const deleteCategory = id => {
  return API.delete(`/api/category/${id}/`);
};

export const getTagList = params => {
  return API.get('/api/tag/', {params});
};

export const postTag = data => {
  return API.post('/api/tag/', data);
};

export const editTag = (id, data) => {
  return API.put(`/api/tag/${id}/`, data);
};

export const deleteTag = id => {
  return API.delete(`/api/tag/${id}/`);
};

export const postComment = data => {
  return API.post('/api/comment/', data);
};

export const getCommentList = params => {
  return API.get('/api/comment/', {params});
};

export const editComment = (id, data) => {
  return API.put(`/api/comment/${id}/`, data);
};

export const deleteCommentById = id => {
  return API.delete(`/api/comment/${id}/`);
};