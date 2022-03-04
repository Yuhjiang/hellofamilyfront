import {API, API_PREFIX} from "./api";

const PREFIX = API_PREFIX + "post";

export const getArticleList = params => {
  return API.get(`${PREFIX}/`, {params})
};


export const getArticleById = id => {
  return API.get(`${PREFIX}/${id}/`)
};

export const deleteArticle = id => {
  return API.delete(`${PREFIX}/${id}/`)
};

export const updateArticleAuto = (id, data) => {
  // 自动保存的文章存为草稿
  data.status = 2;
  return API.put(`${PREFIX}/${id}/`, data);
};

export const updateArticle = (id, data) => {
  data.status = 1;
  return API.put(`${PREFIX}/${id}/`, data);
};

export const uploadPicture = data => {
  return API.post(`${PREFIX}/upload_picture/`, data, {
    headers: {"Content-Type": "multipart/form-data"}
  });
};

export const postArticle = data => {
  return API.post(`${PREFIX}/`, data);
};

export const getCategoryList = params => {
  return API.get(`${PREFIX}/category/`, {params});
};

export const postCategory = data => {
  return API.post(`${PREFIX}/category/`, data);
};

export const editCategory = (id, data) => {
  return API.put(`${PREFIX}/category/${id}/`, data);
};

export const deleteCategory = id => {
  return API.delete(`${PREFIX}/category/${id}/`);
};

export const getTagList = params => {
  return API.get(`${PREFIX}/tag/`, {params});
};

export const postTag = data => {
  return API.post(`${PREFIX}/tag/`, data);
};

export const editTag = (id, data) => {
  return API.put(`${PREFIX}/tag/${id}/`, data);
};

export const deleteTag = id => {
  return API.delete(`${PREFIX}/tag/${id}/`);
};

export const postComment = data => {
  return API.post(`${PREFIX}/comment/`, data);
};

export const getCommentList = params => {
  return API.get(`${PREFIX}/comment/`, {params});
};

export const editComment = (id, data) => {
  return API.put(`${PREFIX}/comment/${id}/`, data);
};

export const deleteCommentById = id => {
  return API.delete(`${PREFIX}/comment/${id}/`);
};