import {PictureOutlined, ReadOutlined, SettingOutlined, TeamOutlined} from "@ant-design/icons";

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
  AdminUser,
  UserProfile,
  UserEdit,
  AdminCarousel,
} from "../views";
import user from "../reducers/user";


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
    pathname: "/user/:id/profile/edit",
    component: UserEdit,
    title: "编辑个人信息",
  },
  {
    pathname: "/user/:id/profile",
    component: UserProfile,
    title: "个人信息",
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

export const helloProjectManage = [
  {
    pathname: "/manage/pictures",
    component: AdminPictures,
    title: "图片管理",
  },
];

export const articleManage = [
  {
    pathname: "/manage/categories",
    component: AdminCategories,
    title: "分类管理"
  },
  {
    pathname: "/manage/tags",
    component: AdminTags,
    title: "标签管理"
  },
  {
    pathname: "/manage/articles",
    component: AdminArticles,
    title: "文章管理",
  },
];

export const userManage = [
  {
    pathname: "/manage/user",
    component: AdminUser,
    title: "用户管理",
  }
];

export const commonManage = [
  {
    pathname: "/manage/carousel",
    component: AdminCarousel,
    title: "走马灯管理",
  },
];

export const adminRouter = [
  {
    pathname: "/manage",
    component: Manage,
    title: "控制台",
    root: true,
  },
  ...helloProjectManage,
  ...articleManage,
  ...userManage,
  ...commonManage,
];

export const adminSubMenus = [
  {
    title: "Hello!Project",
    routers: helloProjectManage,
    logo: PictureOutlined,
  },
  {
    title: "文章管理",
    routers: articleManage,
    logo: ReadOutlined,
  },
  {
    title: "用户管理",
    routers: userManage,
    logo: TeamOutlined,
  },
  {
    title: "常规管理",
    routers: commonManage,
    logo: SettingOutlined,
  }
];