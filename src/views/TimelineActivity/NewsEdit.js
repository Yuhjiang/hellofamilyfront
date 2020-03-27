import React, {Component} from 'react';
import {
  Button, Card, Col, Row, Divider, Form, Input, Select, Spin, DatePicker,
  message, PageHeader
} from "antd";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import moment from "moment";

import {getHelloNewsById, editHelloNews, getNewsTypeList} from "../../api/news";
import {getGroups, getMembers} from "../../api";
import {uploadPicture} from "../../api/articles";

const {Option} = Select;
const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
};

const titleWrapperCol = {
  xs: 24, sm: 24, md: 12, lg: 12
};

const basicWrapperCol = {
  xs: 12, sm: 12, md: 6, lg: 6
};

const groupMemberWrapperCol = {
  xs: 24, sm: 24, md: 12, lg: 12
};

class NewsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      categoryList: [],
      groupList: [],
      memberList: [],
      id: this.props.match.params.id,
      content: "",
    }
  }
  formRef = React.createRef();

  componentDidMount() {
    this.setCategory();
    this.setGroups();
    this.setMembers();
    this.getData(this.state.id);
  }

  onFinished = values => {
    this.setState({
      isLoading: true,
    });
    const newValues = {
      ...values,
      content: values.content.toHTML(),
      created_date: values.created_date.format("YYYY-MM-DD"),
    };
    editHelloNews(this.state.id, newValues).then(resp => {
      message.success("成功修改资讯");
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      });
    })
  };

  setCategory = () => {
    getNewsTypeList({limited: 100}).then(resp => {
      this.setState({
        categoryList: resp.results,
      })
    }).catch(err => {
      message.error(err);
    })
  };

  setGroups = () => {
    getGroups({limited: 100}).then(resp => {
      this.setState({
        groupList: resp.results,
      })
    }).catch(err => {
      message.error(err);
    })
  };

  setMembers = () => {
    getMembers({limited: 1000}).then(resp => {
      this.setState({
        memberList: resp.results,
      })
    }).catch(err => {
      message.error(err);
    })
  };

  getData = id => {
    getHelloNewsById(id).then(resp => {
      this.formRef.current.setFieldsValue({
        title: resp.title,
        category: resp.category.id,
        group: resp.group.map(tag => tag.id),
        member: resp.member.map(member => member.id),
        resource: resp.resource,
        content: BraftEditor.createEditorState(resp.content),
        created_date: moment(resp.created_date),
      });
      this.setState({
        content: resp.content,
      })
    }).catch(err => {
      message.error("获取资讯失败")
    })
  };

  uploadPictureFn = param => {
    let fd = new window.FormData();
    fd.append('content', param.file);
    uploadPicture(fd).then(resp => {
      param.success({
        url: resp.data.url,
        meta: {
          id: resp.data.id,
          description: resp.data.description,
        }
      })
    }).catch(err => {
      param.error({
        msg: "unable to load",
      })
    })
  };

  render() {
    return (
      <div>
      <PageHeader
          className="site-page-header"
          onBack={() => {
            this.props.history.push("/activity");
          }}
          title="返回资讯列表"
          style={{backgroundColor: "#fff"}}
        >
      </PageHeader>
      <Card title="编辑资讯" bordered={false} style={{marginTop: 10}}>
        <Spin spinning={this.state.isLoading}>
          <Form
            name="helloNews"
            onFinish={this.onFinished}
            ref={this.formRef}
          >
            <Divider>基本内容</Divider>
            <Row>
              <Col {...titleWrapperCol}>
                <Form.Item
                  label="标题"
                  name="title"
                  rules={[{required: true, message: "你必须输入标题"}]}
                  wrapperCol={{span: 20}}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col {...basicWrapperCol}>
                <Form.Item
                  label="分类"
                  name="category"
                  rules={[{required: true, message: "你必须选择一个分类"}]}
                  {...layout}
                >
                  <Select placeholder="选择分类">
                    {this.state.categoryList.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...basicWrapperCol}>
                <Form.Item
                  label="日期"
                  name="created_date"
                  rules={[{required: true, message: "你必须选择一个日期"}]}
                  {...layout}
                >
                  <DatePicker style={{width: "100%"}}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col {...groupMemberWrapperCol}>
                <Form.Item
                  label="组合"
                  name="group"
                  rules={[
                    {required: true, message: "请选择关联组合"}
                  ]}
                  wrapperCol={{span: 20}}
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择组合"
                    optionLabelProp="label"
                    optionFilterProp="label"
                  >
                    {this.state.groupList.map(item => {
                      return (
                        <Option value={item.id} key={item.id} label={item.name_jp}>
                          {item.name_jp}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...groupMemberWrapperCol}>
                <Form.Item
                  label="成员"
                  name="member"
                  wrapperCol={{span: 20}}
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择成员"
                    optionLabelProp="label"
                    optionFilterProp="label"
                  >
                    {this.state.memberList.map(item => {
                      return (
                        <Option value={item.id} key={item.id} label={item.name_jp}>
                          {item.name_jp}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Divider>相关资源</Divider>
            <Row>
              <Form.Item
                name="resource"
              >
                <Input.TextArea allowClear cols={1000} />
              </Form.Item>
            </Row>
            <Divider>资讯内容</Divider>
            <Row>
              <Form.Item
                name="content"
                validateTrigger="onBlur"
                rules={[{
                  required: true,
                  validator: (rule, value) => {
                    if (value.isEmpty()) {
                      return Promise.reject("请输入内容");
                    } else {
                      return Promise.resolve();
                    }
                  }
                }]}
              >
                <BraftEditor
                  className="hello-editor"
                  placeholder="输入内容"
                  media={{
                    uploadFn: this.uploadPictureFn,
                    // validateFn: this.validateFn,
                  }}
                />
              </Form.Item>
            </Row>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      </div>
    );
  }
}

export default NewsEdit;