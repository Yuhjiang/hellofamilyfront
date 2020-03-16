import {message} from "antd";

import actionTypes from "./actionTypes";
import {postComment, getCommentList, deleteCommentById} from "../api/articles";


const startAddComment = () => {
  return {
    type: actionTypes.START_ADD_COMMENT
  }
};

const startGetComment = () => {
  return {
    type: actionTypes.START_GET_COMMENT,
  }
};

const endGetComment = () => {
  return {
    type: actionTypes.END_GET_COMMENT,
  }
};

export const addComment = data => {
  return dispatch => {
    dispatch(startAddComment());
    postComment(data).then(resp => {
      message.success("成功添加评论");
      dispatch(addCommentSuccess());
      dispatch(getComments({offset: 0, limited: 10, status: 1, post_id: resp.post}));
    }).catch(err => {
      message.error(err);
      dispatch(addCommentFailed())
    })
  }
};

const addCommentSuccess = () => {
  return {
    type: actionTypes.ADD_COMMENT_SUCCESS,
  }
};

const addCommentFailed = () => {
  return {
    type: actionTypes.ADD_COMMENT_FAILED
  }
};


export const getComments = params => {
  return dispatch => {
    dispatch(startGetComment());
    getCommentList(params).then(resp => {
      dispatch(getCommentSuccess(resp));
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      dispatch(endGetComment());
    })
  }
};

const getCommentSuccess = data => {
  return {
    type: actionTypes.GET_COMMENT_SUCCESS,
    payload: data,
  }
};

export const setArticle = data => {
  return {
    type: actionTypes.SET_ARTICLE,
    payload: data,
  }
};


export const commentPageChange = offset => {
  return {
    type: actionTypes.COMMENT_PAGE_CHANGE,
    payload: {offset},
  }
};

export const deleteComment = (comment) => {
  return dispatch => {
    deleteCommentById(comment.id).then(resp => {
      message.info("删除了一条评论");
      dispatch(getComments({offset: 0, limited: 10, status: 1, post_id: comment.post}))
    }).catch(err => {
      message.error(err);
    });
  }
};