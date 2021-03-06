import articlesApi from "./api";


export const getArticleList = params => {
  return articlesApi.get('/api/post/', {params})
};


export const getArticleById = id => {
  return articlesApi.get(`/api/post/${id}/`)
};

export const deleteArticle = id => {
  return articlesApi.delete(`/api/post/${id}/`)
};

export const updateArticleAuto = (id, data) => {
  // 自动保存的文章存为草稿
  data.status = 2;
  return articlesApi.put(`/api/post/${id}/`, data);
};

export const updateArticle = (id, data) => {
  data.status = 1;
  return articlesApi.put(`/api/post/${id}/`, data);
};

export const uploadPicture = data => {
  return articlesApi.post('/api/upload_picture', data, {
    headers: {"Content-Type": "multipart/form-data"}
  });
};

export const postArticle = data => {
  return articlesApi.post('/api/post/', data);
};

export const getCategoryList = params => {
  return articlesApi.get('/api/category/', {params});
};

export const postCategory = data => {
  return articlesApi.post('/api/category/', data);
};

export const editCategory = (id, data) => {
  return articlesApi.put(`/api/category/${id}/`, data);
};

export const deleteCategory = id => {
  return articlesApi.delete(`/api/category/${id}/`);
};

export const getTagList = params => {
  return articlesApi.get('/api/tag/', {params});
};

export const postTag = data => {
  return articlesApi.post('/api/tag/', data);
};

export const editTag = (id, data) => {
  return articlesApi.put(`/api/tag/${id}/`, data);
};

export const deleteTag = id => {
  return articlesApi.delete(`/api/tag/${id}/`);
};

export const postComment = data => {
  return articlesApi.post('/api/comment/', data);
};

export const getCommentList = params => {
  return articlesApi.get('/api/comment/', {params});
};

export const editComment = (id, data) => {
  return articlesApi.put(`/api/comment/${id}/`, data);
};

export const deleteCommentById = id => {
  return articlesApi.delete(`/api/comment/${id}/`);
};