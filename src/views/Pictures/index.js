// 展示偶像照片的视图
import React, {Component} from 'react';
import {
  Card,
  message,
  Pagination,
  Spin,
  Form,
  Select,
  Row,
  Button,
  Col,
  List,
  BackTop,
  Popconfirm,
} from "antd";

import {getPictures, getGroups, getMembers} from "../../api";
import {recognizePicture} from "../../api/pictures";

const {Option} = Select;

class Pictures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      page: 1,
      limit: 20,
      total: "",
      isLoading: false,
      selectLoading: false,
      groupFirstList: [],
      memberFirstList: [],
      groupSecondList: [],
      memberSecondList: [],
      groupFirst: "",
      memberFirst: "",
      groupSecond: "",
      memberSecond: "",
    };
  }

  componentDidMount() {
    this.getPicturesList({limit: 20, page: 1});
    this.getGroupList("groupFirst");
  }

  getPicturesList = (params) => {
    this.setState({
      isLoading: true,
    });

    getPictures(params).then(resp => {
      this.setState({
        pictures: resp.data.images,
        total: parseInt(resp.data.count),
        page: parseInt(resp.data.current),
      });
    }).catch(err => {
      message.error("获取数据失败");
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  getGroupList = () => {
    this.setState({
      selectLoading: true,
    });
    getGroups({offset: 0, limited: 100}).then(resp => {
      this.setState({
        groupFirstList: resp.results,
        groupSecondList: resp.results,
      });
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        selectLoading: false,
      })
    })
  };

  handleOnPageChange = (pageNumber) => {
    this.getPicturesList({
      limit: this.state.limit, page: pageNumber,
      member_first: this.state.memberFirst, group_first: this.state.groupFirst,
      member_second: this.state.memberSecond, group_second: this.state.groupSecond,
    });
  };

  handleOnGroupChange = (groupList, value) => {
    getMembers({group_id: value, offset: 0, limited: 100}).then(resp => {
      if (groupList === "groupFirst") {
        this.setState({
          memberFirstList: resp.results
        })
      } else {
        this.setState({
          memberSecondList: resp.results
        })
      }
    }).catch(err => {
      console.log(err);
    });
  };

  handleOnMemberChange = (value) => {
    // getPictures({limit: this.state.limit, page: 1, member})
  };

  handleOnSubmit = (e) => {
    this.setState({
      groupFirst: e.groupFirst,
      memberFirst: e.memberFirst,
      isLoading: true,
    });
    getPictures({
      limit: this.state.limit, page: 1,
      member_first: e.memberFirst, group_first: e.groupFirst,
      member_second: e.memberSecond, group_second: e.groupSecond,
    }).then(resp => {
      this.setState({
        pictures: resp.data.images,
        total: parseInt(resp.data.count),
        page: parseInt(resp.data.current),
      })
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      });
    })
  };

  handleOnRecognizePicture = picture => {
    recognizePicture({pictureName: picture}).then(resp => {
      message.info("请稍等片刻");
    }).catch(err => {
      message.error("出现不可知错误");
    })
  };

  render() {
    const colStyle = {
      lg: 6,
      md: 6,
      sm: 12,
      xs: 12,
    };
    return (
      <>
        <Row>
          <Card style={{width: "100%"}} title="选择你想找的组合或成员">
            <Form name="member_select" onFinish={this.handleOnSubmit}>
              <Form.Item name="select_first">
                <Row>
                  <Col {...colStyle}>
                    <Form.Item name="groupFirst">
                      <Select
                        style={{width: "90%"}}
                        onChange={this.handleOnGroupChange.bind(this, "groupFirst")}
                        placeholder="选择组合"
                      >
                        {this.state.groupFirstList.map(group => (
                          <Option key={group.id}
                                  value={group.id}>{group.name_jp}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...colStyle}>
                    <Form.Item name="memberFirst">
                      <Select
                        style={{width: "90%"}}
                        onChange={this.handleOnMemberChange}
                        placeholder="选择成员"
                      >
                        {this.state.memberFirstList.map(member => (
                          <Option key={member.id}
                                  value={member.id}>{member.name_jp}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...colStyle}>
                    <Form.Item name="groupSecond">
                      <Select
                        style={{width: "90%"}}
                        onChange={this.handleOnGroupChange.bind(this, "groupSecond")}
                        placeholder="选择组合"
                      >
                        {this.state.groupSecondList.map(group => (
                          <Option key={group.id}
                                  value={group.id}>{group.name_jp}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...colStyle}>
                    <Form.Item name="memberSecond">
                      <Select
                        style={{width: "90%"}}
                        onChange={this.handleOnMemberChange}
                        placeholder="选择成员"
                      >
                        {this.state.memberSecondList.map(member => (
                          <Option key={member.id}
                                  value={member.id}>{member.name_jp}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  确认
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Row>
        <Row style={{marginTop: 10}}>
          <Spin spinning={this.state.isLoading}>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
              }}
              style={{backgroundColor: "#fff", padding: 10}}
              dataSource={this.state.pictures}
              renderItem={item => (
                <List.Item>
                  <Popconfirm
                    title="确定要更新人脸信息吗"
                    onConfirm={this.handleOnRecognizePicture.bind(this, item.name)}
                    okText="确认"
                    cancelText="取消"
                  >
                  <Card bordered={false} hoverable bodyStyle={{padding: 0}}>
                    <div
                      style={{
                        display: "block",
                        width: "100%",
                        height: 0,
                        paddingBottom: "80%",
                        overflow: "hidden"
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `<a href=${item.url} target="_blank"><img src=${item.url} alt=${item.name} 
                     style="max-width:100%;display:block;"/></a>`
                      }}
                    >
                    </div>
                  </Card>
                  </Popconfirm>
                </List.Item>
              )}
            />
            <Card>
            <Pagination showQuickJumper
                        defaultCurrent={1}
                        current={this.state.page}
                        total={this.state.total}
                        onChange={this.handleOnPageChange}
                        pageSize={this.state.limit}
                        style={{margin: 20, float: "right"}}
            />
            </Card>
            <BackTop />
          </Spin>
        </Row>
      </>
    );
  }
}

export default Pictures;