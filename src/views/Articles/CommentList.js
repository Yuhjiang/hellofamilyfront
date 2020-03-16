import React, {Component} from 'react';
import {Comment, List, Card, Pagination, Avatar, Tooltip} from "antd";
import moment from "moment";
import {connect} from "react-redux";

import {getComments, commentPageChange, deleteComment} from "../../actions/comment";

const mapStateToProps = state => {
  return {
    offset: state.comment.offset,
    limited: state.comment.limited,
    total: state.comment.total,
    postId: state.comment.postId,
    ownerId: state.comment.ownerId,
    getLoading: state.comment.getLoading,
    commentList: state.comment.commentList,
    userId: state.user.id,
    isAdmin: state.user.isAdmin,
  }
};

@connect(mapStateToProps, {getComments, commentPageChange, deleteComment})
class CommentList extends Component {
  handleOnPageChange = page => {
    const offset = (page - 1) * this.props.limited;
    this.props.commentPageChange(offset);
    const params = {
      offset,
      limited: this.props.limited,
      status: 1,
      post_id: this.props.postId
    };
    this.props.getComments(params);
  };

  handleOnDeleteComment = comment => {
    this.props.deleteComment(comment);
  };

  render() {
    return (
      <>
        <Card
          bordered={false}
        >
          <List
            className="comment-list"
            header="评论"
            itemLayout="horizontal"
            dataSource={this.props.commentList}
            loading={this.props.loading}
            renderItem={item => (
              <li key={item.id}>
                <Comment
                  content={item.content}
                  author={item.owner.nickname}
                  datetime={
                    <Tooltip title={moment(item.created_time).format("LLL")}>
                      <span>{moment(item.created_time).fromNow()}</span>
                    </Tooltip>
                  }
                  avatar={
                    <Avatar
                      src={item.owner.avatar}
                      alt={item.owner.nickname}
                    />
                  }
                  actions={[
                    <span key="comment-delete">
                      {this.props.isAdmin || this.props.userId === this.props.ownerId
                        ?
                        <span onClick={this.handleOnDeleteComment.bind(this, item)}>删除</span>
                        :
                        ""
                      }
                    </span>
                  ]}
                />
              </li>
            )}
          />
          <Pagination
            style={{float: "right"}}
            showQuickJumper={true}
            current={this.props.offset / this.props.limited + 1}
            total={this.props.total}
            onChange={this.handleOnPageChange}
          />
        </Card>
      </>
    );
  }
}

export default CommentList;