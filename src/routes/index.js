import {PictureOutlined, ReadOutlined, SettingOutlined, TeamOutlined, FlagOutlined} from "@ant-design/icons";

import {
  Pictures,
  NotFound,
  TimelineActivity,
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
  AdminGroups,
  AdminMembers,
  Chat,
  AdminNewsType,
  AdminHelloNews,
  HelloNewsDetail,
  HelloHistory,
} from "../views";


export const mainRouter = [
  {
    pathname: "/pictures",
    component: Pictures,
    title: "图片库",
    isNav: true,
  },
  {
    pathname: "/activity",
    component: TimelineActivity,
    title: "动态",
    isNav: true,
    exact: true,
  },
  {
    pathname: "/article",
    component: Articles,
    title: "文章",
    isNav: true,
    exact: true,
  },
  {
    pathname: "/history",
    component: HelloHistory,
    title: "ハロー！ヒストリー",
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
    pathname: "/activity/:id",
    component: HelloNewsDetail,
    title: "资讯详情",
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
  {
    pathname: "/chat",
    component: Chat,
    title: "聊天室",
  }
];

export const helloProjectManage = [
  {
    pathname: "/manage/pictures",
    component: AdminPictures,
    title: "图片管理",
  },
  {
    pathname: "/manage/groups",
    component: AdminGroups,
    title: "组合管理",
  },
  {
    pathname: "/manage/members",
    component: AdminMembers,
    title: "成员管理",
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

export const activityManage = [
  {
    pathname: "/manage/news-type",
    component: AdminNewsType,
    title: "资讯类型"
  },
  {
    pathname: "/manage/activity",
    component: AdminHelloNews,
    title: "资讯管理"
  }
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
  ...activityManage,
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
  },
  {
    title: "动态管理",
    routers: activityManage,
    logo: FlagOutlined,
  }
];