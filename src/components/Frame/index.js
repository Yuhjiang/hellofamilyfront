// 页面主要框架，导航栏，侧边栏，页脚等组件
import React, {Component} from 'react';
import {
  Card,
  Layout,
  Menu,
  Badge,
  Dropdown,
  Avatar,
  Row,
  Col,
  notification
} from "antd";
import {DownOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {GithubOutlined, WeiboCircleOutlined} from "@ant-design/icons";
import moment from "moment";

import {logout} from "../../actions/user"
import logo from "./hellofamily.png";
import "./frame.less";
import {wsURL} from "../../config";

const {Header, Content, Footer, Sider} = Layout;
const windowWidth = document.documentElement.clientWidth;
const minWidth = 720;
const OVERTIME = 5 * 24 * 60 * 60;   // 登录有效时间为5天

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    isLogin: state.user.isLogin,
    avatar: state.user.avatar ||
      "http://cdn.hellofamily.club/logo%E7%9A%84%E5%89%AF%E6%9C%AC_Za0oX70.png",
    nickname: state.user.nickname,
    loginTime: state.user.login_time ? moment(state.user.login_time) : undefined,
  }
};


@connect(mapStateToProps, {logout})
class Frame extends Component {
  static propTypes = {
    menus: PropTypes.array,
    userId: PropTypes.number,
    isLogin: PropTypes.bool,
    avatar: PropTypes.string,
    nickname: PropTypes.string,
    loginTime: PropTypes.object,
    logout: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      socket: new WebSocket(wsURL + "notification/" +
        (this.props.userId || 0)),
      displayLogo: windowWidth > minWidth,
    };
    this.checkLoginStatus();
    this.timeInterval = window.setInterval(this.checkLoginStatus, 5 * 1000);
  }

  componentDidMount() {
    this.ready();
    window.onresize = () => {
      this.displayLogoOrNot();
    };
  }

  componentWillUnmount() {
    window.clearInterval(this.timeInterval);
  }

  checkLoginStatus = () => {
    const currentTime = moment();
    const loginTime = this.props.loginTime;
    if (loginTime && currentTime.diff(loginTime, 'seconds') > OVERTIME) {
      this.props.logout("登录超时，请重新登录");
    }
  };

  displayLogoOrNot = () => {
    const windowWidth = document.documentElement.clientWidth;
    this.setState({
      displayLogo: windowWidth > minWidth,
    });
  };

  handleOnMenuClick = ({key}) => {
    this.props.history.push(key);
  };

  onDropdownMenuClick = ({key}) => {
    console.log(key);
    this.props.history.push(key);
  };

  openNotification = (message) => {
    notification.open({
      message: `来自 ${message.from} 的信息`,
      description: message.message,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  ready = () => {
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

  onClickLogout = () => {
    this.props.logout('成功退出登录状态');
  }

  renderDropdown = () => {
    // 右上角下拉框功能
    const menu = (
      <Menu onClick={this.onDropdownMenuClick}>
        <Menu.Item key={`/user/${this.props.userId}/notifications`}
                   disabled={!this.props.isLogin}>
          <Badge dot={Boolean(this.props.notificationsCount)}>
            <div>通知中心</div>
          </Badge>
        </Menu.Item>
        <Menu.Item key={`/user/${this.props.userId}/profile`}
                   disabled={!this.props.isLogin}>
          <div>个人信息</div>
        </Menu.Item>
        {
          this.props.isLogin
            ?
            <Menu.Item key="/" onClick={this.onClickLogout}>
              <div>退出登录</div>
            </Menu.Item>
            :
            <Menu.Item key="/login">
              <div>登录</div>
            </Menu.Item>
        }
      </Menu>
    );
    return menu;
  };

  render() {
    return (
      <>
        <Layout>
          <Header style={{
            position: 'fixed',
            zIndex: 10,
            width: '100%',
            backgroundColor: "#fff",
            padding: 0
          }}>
            {
              this.state.displayLogo
                ?
                <div className="logo">
                  <img src={logo} alt="hellofamily.club logo"/>
                </div>
                :
                ""
            }
            <Row>
              <Col flex="auto">
                <Menu
                  theme="light"
                  mode="horizontal"
                  selectedKeys={this.props.location.pathname.split("/").slice(0, 2).join("/")}
                  style={{lineHeight: '64px'}}
                  onClick={this.handleOnMenuClick}
                >
                  {this.props.menus.map(item => {
                    return (
                      <Menu.Item key={item.pathname} style={{fontSize: 16}}>
                        {item.title}
                      </Menu.Item>
                    )
                  })}
                </Menu>
              </Col>
              <Col flex="auto">
                <Dropdown overlay={this.renderDropdown}
                          trigger={['click', "hover"]}
                >
                  <div style={{float: "right", marginRight: 64}}>
                <span>
                  <Badge count={this.props.notificationsCount}>
                    <Avatar src={this.props.avatar} alt="头像"/>
                  </Badge>
                  {this.state.displayLogo
                  ?
                    <span
                    style={{paddingLeft: "1em"}}>{this.props.nickname || "游客"}
                  </span>
                    :
                    ""
                  }
                  <DownOutlined/>
                </span>
                  </div>
                </Dropdown>
              </Col>
            </Row>
          </Header>
          <Layout style={{marginTop: 80}}>
            <Content style={{backgroundColor: "#f0f2f5", padding: "0 0 24px 24px"}}>
              {this.props.children}
            </Content>
            <Sider
              breakpoint="lg"
              collapsedWidth="0"
              theme="light"
              style={{marginLeft: 20, backgroundColor: "#f1f2f6"}}
              width={330}
            >
              <Card title="关于我" bordered={false}>
                <div>
                  <span style={{margin: "0 20px"}}>
                  <WeiboCircleOutlined style={{margin: "0 10px 0 10px"}}/>
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a href="https://weibo.com/p/1005051737276257/"
                       target="_blank" rel="noreferrer noopener" style={{color: "#000"}}>
                    裸夏SN
                  </a>
                  </span>
                  <span style={{margin: "0 20px"}}>
                  <GithubOutlined style={{margin: "0 10px 0 10px"}}/>
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a href="https://github.com/Yuhjiang" target="_blank"
                       style={{color: "#000"}}>
                    YuhaoJ
                  </a>
                  </span>
                </div>
              </Card>
              <Card title="网易云音乐" bordered={false} style={{marginTop: 10}}>
                <div dangerouslySetInnerHTML={{
                  __html: '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=280 height=400 src="//music.163.com/outchain/player?type=1&id=85470455&auto=0&height=430"></iframe>'
                }}
                />
              </Card>
            </Sider>
          </Layout>
          <Footer style={{textAlign: 'center'}}>
            Hellofamily.club @ 裸夏 <a
            href="http://www.beian.miit.gov.cn">浙ICP备17021080号-2</a>
          </Footer>
        </Layout>,
      </>
    );
  }
}

export default withRouter(Frame);