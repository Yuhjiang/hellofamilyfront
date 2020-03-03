import React, {Component} from 'react';
import {Button, Card, Form, Input, Row, Col, Modal} from "antd";
import {ChromePicker} from "react-color";


class AdminCategories extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      addLoading: false,
      color: "#fff",
      showAddColor: false,
    }
  }

  addFinished = values => {
    console.log(values);
  };

  addFinishedFailed = errorInfo => {
    console.log(errorInfo);
  };

  handleColorChange = (color, event) => {
    this.setState({
      color: color.hex,
    });
    this.formRef.current.setFieldsValue({
      color: color.hex
    });
  };

  showAddColorModal = () => {
    this.setState({
      showAddColor: true,
    })
  };

  hideAddColorModal = () => {
    this.setState({
      showAddColor: false,
    })
  };


  render() {
    return (
      <>
        <Card title="添加文章分类">
          <Form
            name="addCategory"
            onFinish={this.addFinished}
            onFinishFailed={this.addFinishedFailed}
            ref={this.formRef}
          >
            <Row>
              <Col span={10}>
                <Form.Item
                  label="分类名"
                  name="name"
                  wrapperCol={{span: 16}}
                  rules={[
                    {required: true, message: "请输入分类名"},
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="分类颜色"
                  name="color"
                  wrapperCol={{span: 16}}
                >
                  <Button onClick={this.showAddColorModal} type="dashed"
                          block
                          style={{backgroundColor: this.state.color}}>
                    选择颜色
                  </Button>
                  <Modal
                    title="选择颜色"
                    visible={this.state.showAddColor}
                    onOk={this.hideAddColorModal}
                    onCancel={this.hideAddColorModal}
                  >
                    <ChromePicker
                      color={this.state.color}
                      onChangeComplete={this.handleColorChange}
                    />
                  </Modal>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{float: "right"}}>
                    确定
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </>
    );
  }
}

export default AdminCategories;