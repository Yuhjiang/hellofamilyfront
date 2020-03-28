import React, {Component} from 'react';
import {Card, Upload, Form, Input, DatePicker, message, Col, Row, Avatar, Button} from "antd";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import moment from "moment";

import {getUserById, updateUserById} from "../../api/user";
import {uploadPicture} from "../../api/articles";


const formLayout = {
  labelCol: {span: 2},
  wrapperCol: {span: 8},
};

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      upLoading: false,
      isSaving: false,
      imageUrl: "",
      fileList: [],
      id: this.props.match.params.id,
      userInfo: {
        username: "",
        nickname: "",
        avatar: "",
        email: "",
        phone: "",
        birthday: "",
      }
    }
  }

  formRef = React.createRef();

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
      });
      this.formRef.current.setFieldsValue({
        ...resp,
        birthday: moment(resp.birthday),
      })
    }).catch(err => {
      message.error(err)
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  onFinish = values => {
    this.setState({
      isSaving: true,
    });

    const newValues = {
      ...values,
      birthday: moment(values.birthday).format("YYYY-MM-DD"),
      avatar: this.state.imageUrl || this.state.userInfo.avatar,
    };
    updateUserById(this.state.id, newValues).then(resp => {
      message.success("修改成功");
      this.props.history.push(`/user/${this.state.id}/profile`);
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        isSaving: false,
      })
    })
  };

  onFinishFailed = error => {
  };

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  onRemove = () => {
    this.setState({
      fileList: [],
    })
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传jpg或png格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    this.setState({
      fileList: [file],
    });
    return false
  };

  handleUpload = () => {
    const {fileList} = this.state;
    const formData = new FormData();
    formData.append("content", fileList[0]);
    this.setState({
      upLoading: true,
    });

    uploadPicture(formData).then(resp => {
      message.success("成功上传头像");
      this.setState({
        imageUrl: resp.data.url,
      })
    }).catch(err => {
      message.error("上传失败");
    }).finally(() => {
      this.setState({
        upLoading: false,
      })
    })
  };

  handleChange = info => {
    if (info.file.status === "uploading") {
      this.setState({pictureLoading: true});
      return;
    }
    if (info.file.status === "done") {
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          pictureLoading: false,
        }));
    }
  };

  render() {
    return (
      <Card
        title="编辑个人信息"
        bordered={false}
      >
        <Form
          name="userInfo"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          {...formLayout}
          ref={this.formRef}
        >
          <Form.Item
            label="头像"
            name="avatar"
            ref={this.formRef}
          >
            <Row>
              <Col span={4}>
                <Avatar style={{width: 64}} src={this.state.userInfo.avatar}
                        alt="用户头像"
                        shape="square" size="large"/>
              </Col>
              <Col span={4}>
              </Col>
              <Col span={4}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onRemove={this.onRemove}
                >
                  {this.state.imageUrl
                    ?
                    <img src={this.state.imageUrl} alt="上传头像"
                         style={{maxWidth: 100, maxHeight: 100}}/>
                    :
                    <div>
                      {this.state.upLoading ? <LoadingOutlined/> : <PlusOutlined/>}
                      <div className="ant-upload-text">选择头像</div>
                    </div>}
                </Upload>
              </Col>
              <Col span={8}>
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  onClick={this.handleUpload}
                  disabled={this.state.fileList.length === 0}
                  loading={this.state.upLoading}
                >
                  {this.state.upLoading ? "上传中" : "上传"}
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[
              {required: true, message: "请输入你的昵称!"},
              {max: 20, min: 2, message: "昵称长度必须在2-20之内"}
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              {
                required: true,
                message: "请输入你的邮箱!"
              },
              {
                type: "email",
                message: "你输入的邮箱格式不对"
              }
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="手机"
            name="phone"
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="生日"
            name="birthday"
          >
            <DatePicker/>
          </Form.Item>
          <Form.Item
            wrapperCol={{span: 8, offset: 8}}
          >
            <Button
              htmlType="submit" type="primary" loading={this.state.isSaving}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default EditUser;