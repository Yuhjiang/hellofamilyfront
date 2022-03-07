import {API, API_PREFIX} from "./api";

const PREFIX = API_PREFIX + "picture";

export const getGroupById = id => {
  return API.get(`${PREFIX}/group/${id}`);
};

export const getGroups = params => {
  return API.get(`${PREFIX}/group`, {
    params,
  });
};

export const getAllGroups = () => {
  return API.get(`${PREFIX}/all-group`)
}

export const createGroup = data => {
  return API.post(`${PREFIX}/group`, data)
};

export const editGroup = (id, data) => {
  return API.put(`${PREFIX}/group/${id}`, data);
};

export const deleteGroup = id => {
  return API.delete(`${PREFIX}/group/${id}`);
};

export const getPictures = (params) => {
  if (params.member_second !== undefined) {
    let a = params.member_first
    let b = params.member_second
    let double = ""
    if (a > b) {
      double = b + '-' + a
    } else {
      double = a + '-' + b
    }
    params = {double: double}
    return API.get(`${PREFIX}/double`, {
      params
    })
  } else {
    const p = {
      group: params.group_first,
      member: params.member_first,
      page: params.page,
    }
    return API.get(`${PREFIX}/`, {params: p})
  }
};

export const downloadPictures = (data) => {
  return API.post(`${PREFIX}/download`, data,
    {responseType: "blob"})
}

export const getPicturesTimeline = params => {
  return API.get(`${PREFIX}/timeline`, {
    params,
  })
};

export const getMembers = (params) => {
  return API.get(`${PREFIX}/member`, {
    params,
  })
};

export const getAllMembers = (params) => {
  return API.get(`${PREFIX}/all-member`, {
    params,
  })
};

export const getMemberById = (id) => {
  return API.get(`${PREFIX}/member/${id}`);
}

export const createMember = data => {
  return API.post(`${PREFIX}/member`, data)
};

export const editMember = (id, data) => {
  return API.put(`${PREFIX}/member/${id}`, data);
};

export const deleteMember = id => {
  return API.delete(`${PREFIX}/member/${id}`);
};


export const updateCookie = (cookie) => {
  return API.post(`${PREFIX}/cookie`, {
    cookie
  })
};

export const registerMemberFace = (data) => {
  return API.post(`${PREFIX}/member-face`, data);
};

export const getCarouselList = params => {
  return API.get(`${PREFIX}/carousel/`, {params});
};

export const editCarousel = (id, data) => {
  return API.put(`${PREFIX}/carousel/${id}/`, data);
};

export const deleteCarousel = id => {
  return API.delete(`${PREFIX}/carousel/${id}/`);
};

export const createCarousel = data => {
  return API.post(`${PREFIX}/carousel/`, data);
};

export const recognizePicture = data => {
  return API.post(`${PREFIX}/recognize/`, data);
};
