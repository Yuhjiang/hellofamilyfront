import React, {Component} from 'react';
import {Card, Spin, Form, DatePicker, Input, Row, Col, Select, Button} from "antd";

import {getCategoryList, getTagList} from "../../api/articles";

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
    console.log(values);
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