import React, {Component, useState} from 'react';
import {Button, Card, Form, Input, Row, Col, Modal, message, Table, Tag} from "antd";
import {ChromePicker} from "react-color";

import {postCategory, getCategoryList, editCategory} from "../../api/articles";

const displayTitle = {
  "name": "分类名",
  "color": "颜色",
  "post_count": "文章数",
};

class AdminCategories extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const columns = this.createColumns(["name", "color", "post_count"]);
    this.state = {
      addLoading: false,
      color: "#fff",
      showAddColor: false,
      columns: columns,
      dataSource: [],
      total: 0,
      offset: 0,
      limited: 20,
      showEditModal: false,
      currentRecord: {
        "name": "",
        "color": "#fff",
        "id": 0,
      }
    }
  }

  componentDidMount() {
    this.getData(0, this.state.limited);
  }

  getData = (offset, limited) => {
    this.setState({
      isLoading: true,
    });

    getCategoryList(offset, limited).then(resp => {
      console.log(resp);
      this.setState({
        total: resp.count,
        offset: offset,
        dataSource: resp.results,
      })
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    });
  };

  createColumns = (columnKeys) => {
    const columns = columnKeys.map(item => {
      if (item === "color") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          render: (text, record) => {
            const {color} = record;
            return (<Tag color={color}>{color}</Tag>)
          }
        }
      } else if (item === "post_count") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          render: (text, record) => {
            const {post_count} = record;
            return (<Tag color={post_count >= 10 ? "red" : "green"}>{post_count}</Tag>)
          }
        }
      } else {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
        }
      }
    });
    columns.push({
      title: "操作",
      key: "operator",
      render: (text, record) => {
        return (
          <>
            <Button
              size="small"
              onClick={this.onClickEditButton.bind(this, record)}
            >
              编辑
            </Button>
            <Button size="small" danger>删除</Button>
          </>
        )
      }
    });
    return columns;
  };

  addFinished = values => {
    this.setState({
      addLoading: true,
    });

    postCategory(values).then(resp => {
      message.success("成功添加分类");
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        addLoading: false,
        color: "#fff",
      });
      this.formRef.current.setFieldsValue({
        name: "",
      })
    })

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

  onPageChange = (pagination) => {
    console.log(pagination);
  };

  onClickDeleteButton = (id, event) => {
    console.log(id);
  };

  onClickEditButton = (record, event) => {
    this.setState({
      showEditModal: true,
      currentRecord: record,
    })
  };

  onHideEditModal = () => {
    this.setState({
      showEditModal: false,
    })
  };

  onEdit = (id, data) => {
    editCategory(id, data).then(resp => {
      message.success("成功修改分类");
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.onHideEditModal();
      this.getData(0, this.state.limited);
    })
  };

  render() {
    return (
      <>
        <Card
          title="添加文章分类"
          style={{marginTop: 10}}
        >
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
                  <Button type="primary" htmlType="submit" style={{float: "right"}}
                          loading={this.state.addLoading}>
                    确定
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          title="分类列表"
          style={{marginTop: 10}}
        >
          <Table
            rowKey={record => record.id}
            dataSource={this.state.dataSource}
            columns={this.state.columns}
            loading={this.state.isLoading}
            bordered
            pagination={{
              current: this.state.offset / this.state.limited + 1,
              total: this.state.total,
              showQuickJumper: true,
              hideOnSinglePage: true,
              onChange: this.onPageChange,
            }}
          />
          <EditFormInModal
            visible={this.state.showEditModal}
            record={this.state.currentRecord}
            onCreate={this.onEdit}
            onCancel={this.onHideEditModal}
          />
        </Card>
      </>
    );
  }
}


const EditFormInModal = ({visible, record, onCreate, onCancel}) => {
  const [form] = Form.useForm();
  const [color, setColor] = useState(record.color);

  const handleColorChange = (c, event) => {
    if (color !== c.hex) {
      setColor(c.hex);
    }
    form.setFieldsValue({
      color: c.hex
    });
  };

  form.setFieldsValue({
    name: record.name,
    color: record.color,
  });

  return (
    <Modal
      title="修改分类"
      visible={visible}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            console.log(values);
            form.resetFields();
            onCreate(record.id, values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
      onCancel={onCancel}
    >
      <Form
        name="editCategory"
        form={form}
      >
        <Form.Item
          label="分类名"
          name="name"
          rules={[
            {required: true, message: "请输入分类名"}
          ]}
        >
          <input value={record.name}/>
        </Form.Item>
        <Form.Item
          label="颜色"
          name="color"
        >
          <Button type="dashed" block style={{backgroundColor: color}}/>
          <ChromePicker color={color} onChangeComplete={handleColorChange}
                        style={{marginTop: 20}}/>
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default AdminCategories;