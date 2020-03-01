import axios from "axios";
import {message} from "antd";
import {URL} from "../config";

const picturesApi = axios.create({
  baseURL: URL,
  timeout: 3000,
});

picturesApi.interceptors.request.use(config => {
  config.params = Object.assign({}, config.params, {
    format: "json",
  });
  if (config.method !== 'get') {
    config.headers = {
      'Authorization': window.localStorage.getItem("authToken") || window.sessionStorage.getItem("authToken"),
    };
  }
  return config;
});

picturesApi.interceptors.response.use(response => {
  if (response.status === 200) {
    return response.data;
  } else {
    message.error(response.data.errMsg);
  }
}, error => {
  if (error.response.status === 401) {
    // token过期，重新更新cookie
    setAuthToken();
  }
});


const setAuthToken = () => {
  // 更新token
  if (window.localStorage.getItem("refreshToken")) {
    refreshToken(window.localStorage.getItem("refreshToken")).then(resp => {
      window.localStorage.setItem("authToken", resp.access)
      }
    )
  } else {
    refreshToken(window.sessionStorage.getItem("refreshToken")).then(resp => {
        window.sessionStorage.setItem("authToken", resp.access)
      }
    )
  }
};

export const getGroupById = (id) => {
  return picturesApi.get(`/api/group/${id}`);
};

export const getGroups = (params) => {
  return picturesApi.get('/api/group', {
    params,
  });
};

export const getPictures = (params) => {
  return picturesApi.get("/api/pictures", {
    params
  })
};

export const getMembers = (params) => {
  return picturesApi.get('/api/member', {
    params,
  })
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