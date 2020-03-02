import {
  Pictures,
  NotFound,
  TimelinePictures,
  Login,
  Manage,
  Articles,
  AddArticle,
  ArticleDetail
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
    pathname: '/article',
    component: Articles,
    title: "博客",
    isNav: true,
    exact: true,
  },
  {
    pathname: "/article/add",
    component: AddArticle,
    title: "编写文章",
  },
  {
    pathname: "/article/:id",
    component: ArticleDetail,
    title: "文章详情",
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


export const adminRouter = [
  {
    pathname: "/admin/pictures",
    component: Manage,
    title: "控制台",
  }
];