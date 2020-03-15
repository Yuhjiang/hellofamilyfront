import React, {Component} from 'react';
import {Comment, List, Card, Pagination, message} from "antd";
import moment from "moment";
import {connect} from "react-redux";

import {getComments, commentPageChange} from "../../actions/comment";

const mapStateToProps = state => {
  return {
    offset: state.comment.offset,
    limited: state.comment.limited,
    total: state.comment.total,
    postId: state.comment.postId,
    getLoading: state.comment.getLoading,
    commentList: state.comment.commentList,
  }
};

@connect(mapStateToProps, {getComments, commentPageChange})
class CommentList extends Component {
  constructor(props) {
    super(props);
  };

  componentDidMount() {
    this.props.getComments({
      offset: this.props.offset,
      limited: this.props.limited,
      post_id: this.props.postId,
      status: 1
    })
  }

  handleOnPageChange = page => {
    const offset = (page - 1) * this.props.limited;
    this.props.commentPageChange(offset);
    const params = {
      offset,
      limited: this.props.limited,
      status: 1,
      post: this.props.postId
    };
    this.props.getComments(params);
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
              <li>
                <Comment
                  content={item.content}
                  author={item.owner.nickname}
                  datetime={moment(item.created_time).format("LLL")}
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