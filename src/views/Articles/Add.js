import React, {Component} from 'react';
import {
  Card,
  Spin,
  Form,
  Input,
  Row,
  Col,
  Select,
  Button,
  Divider,
  message
} from "antd";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";

import {getCategoryList, getTagList, updatePicture, postArticle} from "../../api/articles";

const {Option} = Select;

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
};


class AddArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      categories: [],
      tags: [],
    };
  }

  componentDidMount() {
    this.setCategory();
    this.setTag();
  }

  onFinished = values => {
    this.setState({
      isLoading: true,
    });
    console.log(values);
    const newValues = {
      ...values,
      content: values.content.toHTML(),
    };
    postArticle(newValues).then(resp => {
      message.success("成功创建一篇文章");
      this.setState({
        isLoading: false,
      });
      this.props.history.push("/article");
    }).catch(err => {
      console.log(err)
    });
  };

  onFinishFailed = errorInfo => {

  };

  setCategory = () => {
    getCategoryList().then(resp => {
      this.setState({
        categories: resp,
      })
    }).catch(err => {
      console.log(err);
    })
  };

  setTag = () => {
    getTagList().then(resp => {
      this.setState({
        tags: resp,
      })
    }).catch(err => {
      console.log(err);
    })
  };

  uploadPictureFn = param => {
    let fd = new window.FormData();
    fd.append('content', param.file);
    updatePicture(fd).then(resp => {
      console.log(resp);
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

  validateFn = file => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        file.size < 1024 * 100 ? resolve() : reject()
      }, 2000)
    })
  };

  render() {
    return (
      <Card title="编写文章" bordered={false}>
        <Spin spinning={this.state.isLoading}>
          <Form
            name="article"
            onFinish={this.onFinished}
            onFinishFailed={this.onFinishFailed}
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

export default AddArticle;