export const clearTokensAndUserInfo = () => {
  window.localStorage.removeItem("authToken");
  window.localStorage.removeItem("refreshToken");
  window.localStorage.removeItem("userInfo");
  window.sessionStorage.removeItem("authToken");
  window.sessionStorage.removeItem("refreshToken");
  window.sessionStorage.removeItem("userInfo");
};