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

export {
  Pictures,
  NotFound,
  TimelinePictures,
  Login,
}