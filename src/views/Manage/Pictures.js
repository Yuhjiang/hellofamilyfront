import React, {Component} from 'react';
import {Button, Card, Cascader, Col, Form, Input, message, Row, Spin} from "antd";

import {
  getAllGroups, getAllMembers,
  registerMemberFace,
  updateCookie
} from "../../api/pictures";


const wrapperCol = {xs: 24, sm: 24, md: 20, lg: 20};

class AdminPictures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      imageUrl: undefined
    }
  }

  onFinish = values => {
    this.setState({
      isLoading: true,
    });
    updateCookie(values.updateCookie).then(resp => {
      if (resp.status === 200) {
        message.success(resp.errMsg);
      } else {
        message.error(resp.errMsg);
      }
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  render() {
    return (
      <>
        <Card title="更新Cookie" style={{marginTop: 10}}>
          <Spin spinning={this.state.isLoading}>
            <Form name="update_cookie" onFinish={this.onFinish}>
              <Row>
                <Col {...wrapperCol}>
                  <Form.Item
                    label="更新Cookie"
                    name="updateCookie"
                    rules={[{required: true, message: "请输入Cookie"}]}
                    wrapperCol={wrapperCol}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} lg={4} md={4}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit"
                            style={{float: "right"}}>
                      提交
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>
        <UploadPicture/>
      </>
    );
  }
}

class UploadPicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      couldUpload: true,
      fileList: [],
      topOptions: [],   // 最高级的选择项
      finalOptions: [],   // 最后要选择项
      member: "",
    }
  }

  componentDidMount() {
    getAllGroups().then(resp => {
      const options = resp.map(group => {
        return {value: group.id, label: group.name_jp, isLeaf: false}
      });
      this.setState({
        topOptions: options,
      })
    }).catch(err => {
      message.error("获取失败");
    })
  }

  onFinish = values => {
    values.member = values.member[1]
    registerMemberFace(values).then(resp => {
        message.success("注册人脸成功")
    }).catch(err => {
      message.error("注册人脸失败")
    })
  }

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    getAllMembers({group: targetOption.value}).then(resp => {
      targetOption.loading = false;
      targetOption.children = resp.map(member => {
        return {value: member.id, label: member.name_jp, isLeaf: true}
      });
      this.setState({
        topOptions: [...this.state.topOptions],
      })
    }).catch(err => {
      console.log(err);
    })
  };

  onChange = (value, selectOptions) => {
    this.setState({
      member: value[1],
    })
  };

  render() {
    return (
      <Card
        title="更新人脸"
        bordered={false}
        style={{marginTop: 10}}
      >
        <Form name="update_member_face"
              onFinish={this.onFinish}
              autoComplete="off"
        >
        <Row>
          <Col {...wrapperCol}>
            <Form.Item
                label="成员"
                name="member"
                rules={[{required: true, message: "请选择成员"}]}
              >
            <Cascader
              options={this.state.topOptions}
              loadData={this.loadData}
              onChange={this.onChange}
              changeOnSelect
              style={{width: "100%"}}
            />
            </Form.Item>
          </Col>
          <Col {...wrapperCol}>
            <Form.Item
                label="人脸图片URL"
                name="url"
                rules={[{required: true, message: "请输入URL"}]}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={4} md={4}>
            <Form.Item>
              <Button type="primary" htmlType="submit"
                      style={{float: "right"}}>
                提交
              </Button>
            </Form.Item>
          </Col>
        </Row>
        </Form>
      </Card>
    )
  }
}

export default AdminPictures;