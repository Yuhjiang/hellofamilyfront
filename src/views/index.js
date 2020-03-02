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

const TimelinePictures = Loadable({
  loader: () => import("./TimelinePictures"),
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

export {
  Pictures,
  NotFound,
  TimelinePictures,
  Login,
  Manage,
  Articles,
  AddArticle,
  ArticleDetail,
}