import {message} from "antd";

import actionTypes from "./actionTypes";
import {loginUser} from "../api/user";

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
  window.localStorage.removeItem("authToken");
  window.sessionStorage.removeItem("authToken");
  window.localStorage.removeItem("userInfo");
  window.sessionStorage.removeItem("userInfo");
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
        ...userInfo
      } = resp;
      if (data.remember === true) {
        // 用户选中记住我时，持久化存储
        window.localStorage.setItem("authToken", authToken);
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      else {
        window.sessionStorage.setItem("authToken", authToken);
        window.sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      dispatch(loginSuccess(userInfo));
      message.success("成功登录");
    }).catch(err => {
      message.error("用户名或密码错误");
      dispatch(loginFailed());
    });
  };
};

