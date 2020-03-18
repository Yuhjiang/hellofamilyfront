import picturesApi from "./api";


export const getGroupById = id => {
  return picturesApi.get(`/api/group/${id}`);
};

export const getGroups = params => {
  return picturesApi.get('/api/group/', {
    params,
  });
};

export const createGroup = data => {
  return picturesApi.post('/api/group/', data)
};

export const editGroup = (id, data) => {
  return picturesApi.put(`/api/group/${id}/`, data);
};

export const deleteGroup = id => {
  return picturesApi.delete(`/api/group/${id}/`);
};

export const getPictures = (params) => {
  return picturesApi.get("/api/pictures", {
    params
  })
};

export const getPicturesTimeline = params => {
  return picturesApi.get("api/pictures/timeline/", {
    params,
  })
};

export const getMembers = (params) => {
  return picturesApi.get('/api/member/', {
    params,
  })
};

export const createMember = data => {
  return picturesApi.post('/api/member/', data)
};

export const editMember = (id, data) => {
  return picturesApi.put(`/api/member/${id}/`, data);
};

export const deleteMember = id => {
  return picturesApi.delete(`/api/member/${id}/`);
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

export const recognizePicture = data => {
  return picturesApi.post('/api/recognize_picture/', data);
};
