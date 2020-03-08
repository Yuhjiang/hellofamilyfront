import {message} from "antd";

import actionTypes from "../actions/actionTypes";
import {clearTokensAndUserInfo} from "../utils";

const isLogin = Boolean(window.localStorage.getItem("authToken"))
  || Boolean(window.sessionStorage.getItem("authToken"));
const userInfo = JSON.parse(window.localStorage.getItem("userInfo"))
  || JSON.parse(window.sessionStorage.getItem("userInfo"));
const initState = {
  ...userInfo,
  isLogin: isLogin,
  isLoading: false,
};

const anonymousState = {
  id: "",
  nickname: "",
  avatar: "",
  role: "",
  isLogin: false,
  isLoading: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case actionTypes.START_LOGIN:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.LOGIN_FAILED:
      return anonymousState;
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...action.payload.userInfo,
        isLogin: true,
        isLoading: false
      };
    case actionTypes.LOGOUT:
      clearTokensAndUserInfo();
      message.success("成功退出登录");
      return anonymousState;
    default:
      return state;
  }
}