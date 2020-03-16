import React, {Component} from 'react';
import {Button, Card, Input} from "antd";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {addComment} from "../../actions/comment";

const {TextArea} = Input;

const mapStateToProps = state => {
  return {
    postId: state.comment.postId,
    ownerId: state.comment.ownerId,
    addLoading: state.comment.addLoading,
  }
};

@connect(mapStateToProps, {addComment})
class AddComment extends Component {
  static propTypes = {
    postId: PropTypes.number.isRequired,
    ownerId: PropTypes.number.isRequired,
    addLoading: PropTypes.bool.isRequired,
    addComment: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      isLoading: false,
    }
  }

  handleOnChange = event => {
    this.setState({
      value: event.target.value,
    })
  };

  addComment = () => {
    this.props.addComment({
      post: this.props.postId,
      to_user: this.props.ownerId,
      content: this.state.value,
    });
    this.setState({
      value: "",
    })
  };

  render() {
    return (
      <Card
        title="写下你的评论"
        bordered={false}
        style={{marginTop: 10}}
        extra={<Button onClick={this.addComment} type="primary" loading={this.state.isLoading}>确定</Button>}
      >
        <TextArea
          rows={4}
          allowClear={true}
          value={this.state.value}
          onChange={this.handleOnChange}
        />
      </Card>
    );
  }
}

export default AddComment;