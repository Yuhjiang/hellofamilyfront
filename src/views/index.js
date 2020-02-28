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


export {
  Pictures,
  NotFound,
}