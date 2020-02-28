import {
  Pictures,
  NotFound,
} from "../views";


export const mainRouter = [
  {
    pathname: "/pictures",
    component: Pictures,
  },
  {
    pathname: "/404",
    component: NotFound,
  },
];
