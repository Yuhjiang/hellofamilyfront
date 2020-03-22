import Loadable from "react-loadable";

import Loading from "./Loading";

const Pictures = Loadable({
  loader: () => import("./Pictures"),
  loading: Loading,
});

const NotFound = Loadable({
  loader: () => import("./NotFound"),
  loading: Loading,
});

const TimelineActivity = Loadable({
  loader: () => import("./TimelineActivity"),
  loading: Loading,
});


const Login = Loadable({
  loader: () => import("./Login"),
  loading: Loading,
});


const Manage = Loadable({
  loader: () => import("./Manage"),
  loading: Loading,
});


const Articles = Loadable({
  loader: () => import("./Articles"),
  loading: Loading,
});

const AddArticle = Loadable({
  loader: () => import("./Articles/Add"),
  loading: Loading,
});

const ArticleDetail = Loadable({
  loader: () => import("./Articles/Detail"),
  loading: Loading,
});

const AdminPictures = Loadable({
  loader: () => import("./Manage/Pictures"),
  loading: Loading,
});

const AdminCategories = Loadable({
  loader: () => import("./Manage/Categories"),
  loading: Loading,
});

const AdminTags = Loadable({
  loader: () => import("./Manage/Tags"),
  loading: Loading,
});

const AdminArticles = Loadable({
  loader: () => import("./Manage/Articles"),
  loading: Loading,
});

const EditArticle = Loadable({
  loader: () => import("./Articles/Edit"),
  loading: Loading,
});

const UserProfile = Loadable({
  loader: () => import("./User"),
  loading: Loading,
});

const UserEdit = Loadable({
  loader: () => import("./User/Edit"),
  loading: Loading,
});

const AdminUser = Loadable({
  loader: () => import("./Manage/User"),
  loading: Loading,
});

const AdminCarousel = Loadable({
  loader: () => import("./Manage/CarouselPictures"),
  loading: Loading,
});

const AdminGroups = Loadable({
  loader: () => import("./Manage/Groups"),
  loading: Loading,
});

const AdminMembers = Loadable({
  loader: () => import("./Manage/Members"),
  loading: Loading,
});

const Chat = Loadable({
  loader: () => import("./Chat"),
  loading: Loading,
});

const AdminNewsType = Loadable({
  loader: () => import("./Manage/NewsType"),
  loading: Loading,
});

const AdminHelloNews = Loadable({
  loader: () => import("./Manage/HelloNews"),
  loading: Loading,
});

const HelloNewsDetail = Loadable({
  loader: () => import("./TimelineActivity/HelloNewsDetail"),
  loading: Loading,
});

export {
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
}