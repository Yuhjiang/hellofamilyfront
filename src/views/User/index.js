import React, {Component} from 'react';
import {Card, Button, Descriptions, message, Tag} from "antd";
import moment from "moment";

import {getUserById} from "../../api/user";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      id: this.props.match.params.id,
      isLoading: false,
      userInfo: {
        username: "",
        nickname: "",
        avatar: "",
        email: "",
        phone: "",
        birthday: "",
      },
    }
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = () => {
    this.setState({
      isLoading: true,
    });

    getUserById(this.state.id).then(resp => {
      this.setState({
        userInfo: resp,
      })
    }).catch(err => {
      message.error(err)
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  onClickEditButton = () => {
    this.props.history.push(`/user/${this.state.id}/profile/edit`);
  };

  render() {
    return (
      <>
        <Card
          title="个人信息"
          loading={this.state.isLoading}
          bordered={false}
          extra={(<Button onClick={this.onClickEditButton}>编辑</Button>)}
        >
          <Descriptions title="基本信息">
            <Descriptions.Item label="头像">
              <img src={this.state.userInfo.avatar} alt="用户头像"
                   style={{maxWidth: 64, maxHeight: 64}}/>
            </Descriptions.Item>
            <Descriptions.Item label="用户名">{this.state.userInfo.username}</Descriptions.Item>
            <Descriptions.Item label="昵称">{this.state.userInfo.nickname}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{this.state.userInfo.email}</Descriptions.Item>
            <Descriptions.Item label="手机">{this.state.userInfo.phone}</Descriptions.Item>
            <Descriptions.Item label="生日">
              {moment(this.state.userInfo.birthday).format("LL")}
            </Descriptions.Item>
            <Descriptions.Item label="权限">
              {this.state.userInfo.is_admin ? <Tag color="red">管理员</Tag> : <Tag>普通用户</Tag>}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="社交平台">
            <Descriptions.Item label="微博">
              {/* eslint-disable-next-line react/jsx-no-target-blank */}
              <a href="https://weibo.com/1737276257/profile" target="_blank" rel="noreferrer noopener">裸夏SN</a>
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card
          title="近期动态"
          bordered={false}
          style={{marginTop: 20}}
        >
        </Card>
      </>
    );
  }
}

export default UserProfile;