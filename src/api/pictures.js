import {API, API_PREFIX} from "./api";

const PREFIX = API_PREFIX + "pictures/";

export const getGroupById = id => {
  return API.get(`${PREFIX}group/${id}`);
};

export const getGroups = params => {
  return API.get(`${PREFIX}group/`, {
    params,
  });
};

export const createGroup = data => {
  return API.post(`${PREFIX}group/`, data)
};

export const editGroup = (id, data) => {
  return API.put(`${PREFIX}group/${id}/`, data);
};

export const deleteGroup = id => {
  return API.delete(`/api/group/${id}/`);
};

export const getPictures = (params) => {
  return API.get(`${PREFIX}`, {
    params
  })
};

export const downloadPictures = (data) => {
  return API.post("/api/download_pictures/", data,
    {responseType: "blob"})
}

export const getPicturesTimeline = params => {
  return API.get("api/pictures/timeline/", {
    params,
  })
};

export const getMembers = (params) => {
  return API.get('/api/member/', {
    params,
  })
};

export const createMember = data => {
  return API.post('/api/member/', data)
};

export const editMember = (id, data) => {
  return API.put(`/api/member/${id}/`, data);
};

export const deleteMember = id => {
  return API.delete(`/api/member/${id}/`);
};


export const updateCookie = (cookie) => {
  return API.post('/api/cookie', {
    cookie
  })
};

export const registerMemberFace = (data) => {
  return API.post('/api/face', data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getCarouselList = params => {
  return API.get('/api/carousel', {params});
};

export const editCarousel = (id, data) => {
  return API.put(`/api/carousel/${id}/`, data);
};

export const deleteCarousel = id => {
  return API.delete(`/api/carousel/${id}/`);
};

export const createCarousel = data => {
  return API.post('/api/carousel/', data);
};

export const recognizePicture = data => {
  return API.post('/api/recognize_picture/', data);
};
