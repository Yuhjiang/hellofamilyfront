import {API, API_PREFIX} from "./api";


const USER_PREFIX = API_PREFIX + "user/";

export const loginUser = userInfo => {
  return API.post(USER_PREFIX + "login", userInfo);
};

export const registerUser = userInfo => {
  return API.post('/api/register', userInfo);
};

export const getUserById = id => {
  return API.get(`/api/user/${id}/`);
};

export const updateUserById = (id, data) => {
  return API.put(`/api/user/${id}/`, data);
};

export const getUserList = params => {
  return API.get('/api/user/', {params})
};

export const deleteUserById = id => {
  return API.delete(`/api/user/${id}/`);
};
