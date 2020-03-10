import React, {Component} from 'react';
import {Button, Card, Col, Divider, Form, Input, Row, Select, Spin, message} from "antd";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";

import {
  getCategoryList,
  getTagList,
  updateArticle,
  updateArticleAuto,
  getArticleById, uploadPicture
} from "../../api/articles";

const {Option} = Select;

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
};


class EditArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      categories: [],
      tags: [],
      id: this.props.match.params.id,
      content: undefined,
      autoSaving: false,
    };
  }

  formRef = React.createRef();

  componentDidMount() {
    this.getData(this.state.id);
    this.setCategory();
    this.setTag();
    this.updateAuto = setInterval(this.updateArticleAutomatically, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.updateAuto);
  }

  updateArticleAutomatically = () => {
    this.setState({
      autoSaving: true,
    });

    this.formRef.current.validateFields().then(values => {
      const newValues = {
        ...values,
        draft: values.content.toHTML(),
        content: this.state.content,
      };
      updateArticleAuto(this.state.id, newValues).then(resp => {
        this.setState({
          isLoading: false,
        });
      }).catch(err => {
        message.error("你没有权限创建文章");
      }).finally(() => {
        this.setState({
          autoSaving: false
        })
      });
    });
  };

  getData = id => {
    getArticleById(id).then(resp => {
      this.formRef.current.setFieldsValue({
        title: resp.title,
        category: resp.category.id,
        tag: resp.tag.map(tag => tag.id),
        desc: resp.desc,
        content: resp.status === 2
          ?
          BraftEditor.createEditorState(resp.draft)
          :
          BraftEditor.createEditorState(resp.content)
      });
      this.setState({
        content: resp.content,
      })
    }).catch(err => {
      message.error("获取文章失败")
    })
  };

  setCategory = () => {
    getCategoryList().then(resp => {
      this.setState({
        categories: resp.results,
      })
    }).catch(err => {
      console.log(err);
    })
  };

  setTag = () => {
    getTagList().then(resp => {
      this.setState({
        tags: resp.results,
      })
    }).catch(err => {
      console.log(err);
    });
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

  onFinished = values => {
    this.setState({
      isLoading: true,
    });
    const newValues = {
      ...values,
      content: values.content.toHTML(),
    };
    updateArticle(this.state.id, newValues).then(resp => {
      message.success("成功修改文章");
      this.setState({
        isLoading: false,
      });
      this.props.history.push("/article");
    }).catch(err => {
      message.error("你没有权限创建文章");
    }).finally(() => {
      this.setState({
        isLoading: false
      })
    });
  };

  render() {
    return (
      <Card title="编辑文章" bordered={false}
            extra={this.state.autoSaving ? <span>自动保存中...</span> : ""}>
        <Spin spinning={this.state.isLoading}>
          <Form
            name="article"
            onFinish={this.onFinished}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
          >
            <Row>
              <Col sm={24} xs={24} lg={8} md={8}>
                <Form.Item
                  {...layout}
                  label="标题"
                  name="title"
                  rules={[{required: true, message: "你必须输入标题"}]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col sm={12} xs={12} lg={8} md={8}>
                <Form.Item
                  {...layout}
                  label="分类"
                  name="category"
                  rules={[{required: true, message: "你必须选择一个分类"}]}
                >
                  <Select
                    placeholder="选择分类"
                  >
                    {this.state.categories.map(category => {
                      return (
                        <Option key={category.id} value={category.id}>{category.name}</Option>)
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={12} xs={12} lg={8} md={8}>
                <Form.Item
                  {...layout}
                  label="标签"
                  name="tag"
                  rules={[
                    {required: true, message: "请选择标签"},
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="选择标签"
                  >
                    {this.state.tags.map(tag => {
                      return (<Option key={tag.id} value={tag.id}>{tag.name}</Option>)
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Divider>内容</Divider>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="摘要"
                  name="desc"
                  labelCol={4}
                  rules={[
                    {required: true, message: "请输入摘要"}
                  ]}
                >
                  <Input.TextArea allowClear cols={1000}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item
                label="文章正文"
                name="content"
                validateTrigger="onBlur"
                rules={[{
                  required: true,
                  validator: (rule, value) => {
                    if (value.isEmpty()) {
                      return Promise.reject("请输入正文");
                    } else {
                      return Promise.resolve();
                    }
                  }
                }]}
              >
                <BraftEditor
                  className="hello-editor"
                  placeholder="输入正文"
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
    );
  }
}

export default EditArticle;