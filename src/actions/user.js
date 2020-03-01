import {message} from "antd";

import actionTypes from "./actionTypes";
import {loginUser} from "../api/user";

const removeSessionStorage = (items) => {
  items.forEach(item => {
    window.sessionStorage.removeItem(item);
  })
};

const setSessionStorage = (items) => {
  Object.keys(items).forEach(key => {
    window.sessionStorage.setItem(key, items[key]);
  })
};

const removeLocalStorage = (items) => {
  items.forEach(item => {
    window.localStorage.removeItem(item);
  })
};

const setLocalStorage = (items) => {
  Object.keys(items).forEach(key => {
    window.localStorage.setItem(key, items[key]);
  })
};

const startLogin = () => {
  return {
    type: actionTypes.START_LOGIN,
  }
};

const loginSuccess = (userInfo) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: {
      userInfo
    }
  }
};

const loginFailed = () => {
  const removeItems = ["authToken", "userInfo", "refreshToken"];
  removeSessionStorage(removeItems);
  removeLocalStorage(removeItems);
  return {
    type: actionTypes.LOGIN_FAILED,
    payload: {
      isLoading: false,
    }
  }
};



export const login = (data) => {
  return dispatch => {
    dispatch(startLogin());
    loginUser(data).then(resp => {
      const {
        authToken,
        refreshToken,
        ...userInfo
      } = resp.data;
      if (data.remember === true) {
        // 用户选中记住我时，持久化存储
        setLocalStorage({
          "authToken": "HelloFamily " + authToken,
          "refreshToken": refreshToken,
          "userInfo": JSON.stringify(userInfo),
        });
      }
      else {
        setSessionStorage({
          "authToken": "HelloFamily " + authToken,
          "refreshToken": refreshToken,
          "userInfo": JSON.stringify(userInfo),
        });
      }
      dispatch(loginSuccess(userInfo));
      message.success("成功登录");
    }).catch(err => {
      message.error("用户名或密码错误");
      dispatch(loginFailed());
    });
  };
};

