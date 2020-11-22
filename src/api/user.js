import {API, API_PREFIX} from "./api";


const USER_PREFIX = API_PREFIX + "user";

export const loginUser = userInfo => {
  return API.post(USER_PREFIX + "/login/", userInfo);
};

export const registerUser = userInfo => {
  return API.post(USER_PREFIX  + '/register/', userInfo);
};

export const getUserById = id => {
  return API.get(`${USER_PREFIX}/${id}/`);
};

export const updateUserById = (id, data) => {
  return API.put(`${USER_PREFIX}/${id}/`, data);
};

export const getUserList = params => {
  return API.get(`${USER_PREFIX}/`, {params})
};

export const deleteUserById = id => {
  return API.delete(`${USER_PREFIX}/${id}/`);
};
