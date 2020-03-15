import {combineReducers} from "redux";

import user from "./user";
import comment from "./comment";

export default combineReducers({
  user,
  comment,
})