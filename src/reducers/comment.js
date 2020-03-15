import actionTypes from "../actions/actionTypes";

const initState = {
  postId: 0,
  ownerId: 0,
  comments: [],
  addLoading: false,
  getLoading: false,
  offset: 0,
  limited: 10,
  total: 0,
};

export default (state=initState, action) => {
  switch (action.type) {
    case actionTypes.START_GET_COMMENT:
      return {
        ...state,
        getLoading: true,
      };
    case actionTypes.END_GET_COMMENT:
      return {
        ...state,
        getLoading: false,
      };
    case actionTypes.SET_ARTICLE:
      return {
        ...state,
        postId: action.payload.postId,
        ownerId: action.payload.ownerId,
      };
    case actionTypes.GET_COMMENT_SUCCESS:
      const {payload} = action;
      return {
        ...state,
        commentList: payload.results,
        total: payload.count
      };
    case actionTypes.START_ADD_COMMENT:
      return {
        ...state,
        addLoading: false,
      };
    case actionTypes.COMMENT_PAGE_CHANGE:
      return {
        ...state,
        offset: action.payload.offset
      };
    case actionTypes.ADD_COMMENT_FAILED:
      return {
        ...state,
        addLoading: false,
      };
    default:
      return {
        ...state,
      }
  }
}