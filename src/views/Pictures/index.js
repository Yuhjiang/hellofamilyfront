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
} from "antd";

import {getPictures, getGroups, getMembers} from "../../api";

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
        pictures: resp.images,
        total: parseInt(resp.count),
        page: parseInt(resp.current),
      });
    }).catch(err => {
      message.error("获取数据失败");
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  getGroupList = (groupList) => {
    this.setState({
      selectLoading: true,
    });
    getGroups().then(resp => {
      this.setState({
        groupFirstList: resp.groups,
        groupSecondList: resp.groups,
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
    getMembers({"group_id": value}).then(resp => {
      console.log(resp);
      if (groupList === "groupFirst") {
        this.setState({
          memberFirstList: resp.members
        })
      } else {
        this.setState({
          memberSecondList: resp.members
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
        pictures: resp.images,
        total: parseInt(resp.count),
        page: parseInt(resp.current),
      })
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  render() {
    const gridStyle = {
      width: '25%',
      textAlign: 'center',
      padding: 5,
      margin: "auto",
    };
    return (
      <>
        <Row>
          <Card style={{width: "100%"}} title="选择你想找的组合或成员">
            <Form name="member_select" onFinish={this.handleOnSubmit}>
              <Form.Item name="select_first">
                <Row>
                  <Col span={6}>
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
                  <Col span={6}>
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
                  <Col span={6}>
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
                  <Col span={6}>
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
            <Card>
              {this.state.pictures.map((item, idx) => {
                return (
                  <Card.Grid style={gridStyle} key={idx}>
                    <div
                      style={{
                        display: "block",
                        width: "100%",
                        height: 0,
                        paddingBottom: "80%",
                        overflow: "hidden"
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `<img src=${item.url} alt=${item.name} 
                     style="max-width:100%;display:block;"/>`
                      }}
                    >
                    </div>
                  </Card.Grid>
                )
              })}
            </Card>
            <Pagination showQuickJumper
                        defaultCurrent={1}
                        current={this.state.page}
                        total={this.state.total}
                        onChange={this.handleOnPageChange}
                        pageSize={this.state.limit}
                        style={{margin: 20, float: "right"}}
            />
          </Spin>
        </Row>
      </>
    );
  }
}

export default Pictures;