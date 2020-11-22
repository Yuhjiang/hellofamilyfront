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
  return API.delete(`${PREFIX}group/${id}/`);
};

export const getPictures = (params) => {
  return API.get(`${PREFIX}`, {
    params
  })
};

export const downloadPictures = (data) => {
  return API.post(`${PREFIX}download/`, data,
    {responseType: "blob"})
}

export const getPicturesTimeline = params => {
  return API.get(`${PREFIX}timeline/`, {
    params,
  })
};

export const getMembers = (params) => {
  return API.get(`${PREFIX}member/`, {
    params,
  })
};

export const createMember = data => {
  return API.post(`${PREFIX}member/`, data)
};

export const editMember = (id, data) => {
  return API.put(`${PREFIX}member/${id}/`, data);
};

export const deleteMember = id => {
  return API.delete(`${PREFIX}member/${id}/`);
};


export const updateCookie = (cookie) => {
  return API.post(`${PREFIX}cookie/`, {
    cookie
  })
};

export const registerMemberFace = (data) => {
  return API.post(`${PREFIX}face/`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getCarouselList = params => {
  return API.get(`${PREFIX}carousel/`, {params});
};

export const editCarousel = (id, data) => {
  return API.put(`${PREFIX}carousel/${id}/`, data);
};

export const deleteCarousel = id => {
  return API.delete(`${PREFIX}carousel/${id}/`);
};

export const createCarousel = data => {
  return API.post(`${PREFIX}carousel/`, data);
};

export const recognizePicture = data => {
  return API.post(`${PREFIX}recognize/`, data);
};
