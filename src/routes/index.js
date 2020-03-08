import {
  Pictures,
  NotFound,
  TimelinePictures,
  Login,
  Manage,
  Articles,
  AddArticle,
  EditArticle,
  ArticleDetail,
  AdminPictures,
  AdminCategories,
  AdminTags,
  AdminArticles,
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
    title: "文章",
    isNav: true,
    exact: true,
  },
  {
    pathname: "/article/add",
    component: AddArticle,
    title: "编写文章",
  },
  {
    pathname: "/article/edit/:id",
    component: EditArticle,
    title: "编辑文章",
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
    pathname: "/admin",
    component: Manage,
    title: "控制台",
    root: true,
  },
  {
    pathname: "/admin/pictures",
    component: AdminPictures,
    title: "图片管理",
  },
  {
    pathname: "/admin/categories",
    component: AdminCategories,
    title: "分类管理"
  },
  {
    pathname: "/admin/tags",
    component: AdminTags,
    title: "标签管理"
  },
  {
    pathname: "/admin/articles",
    component: AdminArticles,
    title: "文章管理",
  }
];