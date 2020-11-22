// 展示偶像照片的视图
import React, {Component} from 'react';
import {
  BackTop,
  Button,
  Card,
  Col,
  Form,
  message,
  Pagination,
  Row,
  Select,
  Spin,
} from "antd";

import {downloadPictures, getPicturesTimeline, getGroups, getMembers, getPictures} from "../../api/pictures";
import CardGridPictures from "./CardGridPictures";
import TimelinePicture from "./TimelinePictures";

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
      groupFirst: undefined,
      memberFirst: undefined,
      groupSecond: undefined,
      memberSecond: undefined,
      timelineOrGrid: false,
    };
  }

  formRef = React.createRef();

  componentDidMount() {
    this.getData({page: 1});
    this.getGroupList();
  }

  getPicturesList = (params) => {
    this.setState({
      isLoading: true,
    });

    getPictures(params).then(resp => {
      this.setState({
        pictures: resp.data.result,
        total: parseInt(resp.data.count),
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

  handleOnDownloadPictures = () => {
    const pictures = this.state.pictures.map(pic => ({name: pic.name, url: pic.url}));
    downloadPictures({picture_list: pictures}).then(resp => {
      const dom = document.createElement("a");
      dom.href = window.URL.createObjectURL(resp);
      dom.download = decodeURI("图片.zip");
      dom.style.display = "none";
      document.body.appendChild(dom);
      dom.click();
      dom.parentNode.removeChild(dom);
      message.success("下载成功");
    }).catch(err => {
      console.log(err);
      message.error("下载失败");
    })
  }

  handleOnPageChange = (pageNumber) => {
    this.setState({
      page: pageNumber
    });
    this.getData({
      limit: this.state.limit,
      page: pageNumber,
      member_first: this.state.memberFirst,
      group_first: this.state.groupFirst,
      member_second: this.state.memberSecond,
      group_second: this.state.groupSecond
    })
  };

  handleOnGroupChange = (groupList, value) => {
    if (groupList === "groupFirst") {
      this.formRef.current.setFieldsValue({
        memberFirst: undefined
      })
    } else {
      this.formRef.current.setFieldsValue({
        memberSecond: undefined
      })
    }

    getMembers({group_id: value, offset: 0, limited: 100}).then(resp => {
      if (groupList === "groupFirst") {
        this.setState({
          memberFirstList: resp.results,
        })
      } else {
        this.setState({
          memberSecondList: resp.results,
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
      groupSecond: e.groupSecond,
      memberSecond: e.memberSecond,
      page: 1,
      isLoading: true,
    });
    const params = {
      page: 1,
      member_first: e.memberFirst, group_first: e.groupFirst,
      member_second: e.memberSecond, group_second: e.groupSecond,
    };
    this.getData(params);
  };

  getData = params => {
    if (this.state.timelineOrGrid) {
      getPicturesTimeline(params).then(resp => {
        this.setState({
          pictures: resp.results,
          total: parseInt(resp.count),
        })
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.setState({
          isLoading: false,
        });
      })
    } else {
      getPictures(params).then(resp => {
        this.setState({
          pictures: resp.results,
          total: parseInt(resp.count),
        })
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.setState({
          isLoading: false,
        });
      })
    }
  };

  handleViewChange = () => {
    this.setState(state => {
      return {
        timelineOrGrid: !state.timelineOrGrid,
        pictures: [],
      }
    }, () => {
      this.getData({
        page: this.state.page,
        member_first: this.state.memberFirst,
        group_first: this.state.groupFirst,
        member_second: this.state.memberSecond,
        group_second: this.state.groupSecond
      })
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
          <Card style={{width: "100%"}} title="选择你想找的组合或成员"
                extra={<Button
                  onClick={this.handleViewChange}>{this.state.timelineOrGrid ? "切换成默认" : "切换成时间线"}</Button>}>
            <Form name="member_select" onFinish={this.handleOnSubmit}
                  ref={this.formRef}>
              <Row>
                <Col {...colStyle}>
                  <Form.Item name="groupFirst">
                    <Select
                      style={{width: "90%"}}
                      onChange={this.handleOnGroupChange.bind(this, "groupFirst")}
                      placeholder="选择组合"
                      allowClear={true}
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
                      allowClear={true}
                      value={this.state.memberFirst}
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
                      allowClear={true}
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
                      allowClear={true}
                      value={this.state.memberSecond}
                    >
                      {this.state.memberSecondList.map(member => (
                        <Option key={member.id}
                                value={member.id}>{member.name_jp}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">
                      确认
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={8} offset={8}>
                  <Form.Item style={{float: "right"}}>
                    <Button type="primary" onClick={this.handleOnDownloadPictures}>
                      下载当前页面图片
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Row>
        <Row style={{marginTop: 10, backgroundColor: "#fff", width: "100%"}}>
          <div style={{width: "100%"}}>
            <Spin spinning={this.state.isLoading} size="large" tip="加载图片中...">
              {this.state.timelineOrGrid ?
                <TimelinePicture pictures={this.state.pictures}/> :
                <CardGridPictures pictures={this.state.pictures}/>}
              <BackTop/>
            </Spin>
          </div>
        </Row>
        <Row>
          <Card style={{width: "100%"}}>
            <Pagination showQuickJumper
                        defaultCurrent={1}
                        current={this.state.page}
                        total={this.state.total}
                        onChange={this.handleOnPageChange}
                        pageSize={this.state.limit}
                        style={{margin: 20, float: "right"}}
            />
          </Card>
        </Row>
      </>
    );
  }
}

export default Pictures;