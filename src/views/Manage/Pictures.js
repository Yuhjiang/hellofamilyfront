import React, {Component} from 'react';
import {Button, Card, Cascader, Col, Form, Input, message, Row, Spin, Upload} from "antd";
import {UploadOutlined} from '@ant-design/icons';

import {getGroups, getMembers, registerMemberFace, updateCookie} from "../../api/pictures";


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
        message.success(resp.data.message);
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
        <Card title="更新Cookie">
          <Spin spinning={this.state.isLoading}>
            <Form name="update_cookie" onFinish={this.onFinish}>
              <Row>
                <Col span={20}>
                  <Form.Item
                    label="更新Cookie"
                    name="updateCookie"
                    rules={[{required: true, message: "请输入Cookie"}]}
                    wrapperCol={{span: 20}}
                  >
                    <Input/>
                  </Form.Item>
                </Col>
                <Col span={4}>
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
    getGroups().then(resp => {
      const options = resp.data.groups.map(group => {
        return {value: group.id, label: group.name_jp, isLeaf: false}
      });
      console.log(options);
      this.setState({
        topOptions: options,
      })
    }).catch(err => {
      message.error("获取失败");
    })
  }


  handleUpload = () => {
    const {fileList, member} = this.state;
    console.log(fileList, member);
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append("files[]", file);
    });
    formData.append("member", member);

    this.setState({
      uploading: true,
    });

    registerMemberFace(formData).then(resp => {
      message.success("成功注册人脸");
    }).catch(err => {
      message.error("注册失败");
    }).finally(() => {
      this.setState({
        uploading: false,
        fileList: [],
      })
    });
  };

  onRemove = file => {
    this.setState(state => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    })
  };

  beforeUpload = file => {
    if (file.type === "image/jpeg" || file.type === "image/png") {
      this.setState(state => {
        return {fileList: [...state.fileList, file]};
      });
    } else {
      message.error("只能上传jpg或png的图片");
    }
    return false;
  };

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    getMembers({group_id: targetOption.value}).then(resp => {
      targetOption.loading = false;
      targetOption.children = resp.data.members.map(member => {
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
      >
        <Row>
          <Col span={16}>
            <Cascader
              options={this.state.topOptions}
              loadData={this.loadData}
              onChange={this.onChange}
              changeOnSelect
              style={{width: "60%"}}
            />
          </Col>
          <Col span={4}>
            <Upload
              name="member"
              className="avatar-uploader"
              beforeUpload={this.beforeUpload}
              onRemove={this.onRemove}
              fileList={this.state.fileList}
            >
              <Button>
                <UploadOutlined/>选择文件
              </Button>
            </Upload>
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={this.state.fileList.length === 0 || !this.state.member}
              loading={this.state.uploading}
              style={{float: "right"}}
            >
              {this.state.uploading ? "上传中..." : "开始上传"}
            </Button>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default AdminPictures;