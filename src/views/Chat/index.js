import React, {Component} from 'react';
import {Card, Input, notification} from "antd";
import {connect} from "react-redux";
import {wsURL} from "../../config";

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    isLogin: state.user.isLogin,
    avatar: state.user.avatar ||
      "http://cdn.hellofamily.club/logo%E7%9A%84%E5%89%AF%E6%9C%AC_Za0oX70.png",
    nickname: state.user.nickname
  }
};

@connect(mapStateToProps)
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      socket: new WebSocket(wsURL + "notification/" +
        (this.props.userId || 0)),
    }
  }

  componentDidMount() {
    this.ready();
  }
  openNotification = (message) => {
    notification.open({
      message: `来自 ${message.from} 的信息`,
      description: message.message,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };
  ready =() => {
    const socket = this.state.socket;
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const message = data["message"];
      this.openNotification(message);
    };
    socket.onclose = (e) => {
      console.log("chat socket closed")
    };
  };

  sendMessage = (e) => {
    const value = e.target.value;
    this.state.socket.send(JSON.stringify({message: value}));
  };

  render() {
    return (
      <div>
        <Card
          title="信息"
        >
          {this.state.messages.map(message => (<div>{message}</div>))}
        </Card>
        <Input onPressEnter={this.sendMessage} />
      </div>
    );
  }
}

export default Chat;