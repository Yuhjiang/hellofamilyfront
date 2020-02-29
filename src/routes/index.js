import {
  Pictures,
  NotFound,
  TimelinePictures,
  Login
} from "../views";


export const mainRouter = [
  {
    pathname: "/pictures",
    component: Pictures,
    title: "图片库",
    isNav: true,
  },
  {
    pathname: "/timeline",
    component: TimelinePictures,
    title: "时间线",
    isNav: true,
  },
  {
    pathname: "/404",
    component: NotFound,
    title: "404页面",
  },
];

export const basicRouter = [
  {
    pathname: "/login",
    component: Login,
    title: "登录",
  },
];
