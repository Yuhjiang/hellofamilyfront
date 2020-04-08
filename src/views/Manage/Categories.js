import React, {Component, useEffect} from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
  Modal,
  message,
  Table,
  Tag
} from "antd";
import {ChromePicker} from "react-color";

import {
  postCategory,
  getCategoryList,
  editCategory,
  deleteCategory
} from "../../api/articles";
import {getColumnSearchProps} from "../../utils";

const displayTitle = {
  "name": "分类名",
  "color": "颜色",
  "post_count": "文章数",
};

const buttonLayout = {
  xs: 24, sm: 24, md: 4, lg: 4
};

const inputLayout = {
  xs: 24, sm: 24, md: 10, lg:10
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
      limited: 10,
      showEditModal: false,
      currentRecord: {
        "name": "",
        "color": "#fff",
        "id": 0,
      },
      deleteLoading: false,
      showDeleteModal: false,
      editColor: "#fff",
      searchText: "",
      searchedColumn: "",
    }
  }

  componentDidMount() {
    this.getData();
  }

  assembleParams = () => {
    const params = {
      limited: this.state.limited,
      offset: this.state.offset,
    };
    const {searchText, searchedColumn} = this.state;
    if (searchText && searchedColumn) {
      params[searchedColumn] = searchText;
    }

    return params;
  };

  getData = () => {
    this.setState({
      isLoading: true,
    });

    const params = this.assembleParams();
    getCategoryList(params).then(resp => {
      this.setState({
        total: resp.count,
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
          align: "center",
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
          align: "center",
          render: (text, record) => {
            const {post_count} = record;
            return (<Tag
              color={post_count >= 10 ? "red" : "green"}>{post_count}</Tag>)
          }
        }
      } else if (item === "name") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          ...getColumnSearchProps(displayTitle, item, this.searchInput, this.handleSearch, this.handleReset),
        }
      }
      else {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
        }
      }
    });
    columns.push({
      title: "操作",
      key: "operator",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <Button
              size="small"
              onClick={this.onClickEditButton.bind(this, record)}
            >
              编辑
            </Button>
            <Button size="small" danger
                    onClick={this.onClickDeleteButton.bind(this, record)}
            >
              删除
            </Button>
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
      });
      this.getData();
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

  onPageChange = page => {
    this.setState({
      offset: (page - 1) * this.state.limited,
    }, () => {
      this.getData();
    });
  };

  onClickDeleteButton = (record, event) => {
    this.setState({
      showDeleteModal: true,
      currentRecord: record,
    })
  };

  onClickEditButton = (record, event) => {
    this.setState({
      showEditModal: true,
      currentRecord: record,
      editColor: record.color || "#fff",
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
      this.getData();
    })
  };

  onDelete = id => {
    this.setState({
      deleteLoading: true,
    });
    deleteCategory(id).then(resp => {
      message.success("成功删除分类");
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        deleteLoading: false,
        showDeleteModal: false,
      });
      this.getData();
    })
  };

  onHideDeleteModal = () => {
    this.setState({
      showDeleteModal: false,
    })
  };

  colorChange = (color) => {
    this.setState({
      editColor: color,
    })
  };

  handleSearch = (selectKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectKeys[0],
      searchedColumn: dataIndex,
    })
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({
      searchText: "",
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
              <Col {...inputLayout}>
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
              <Col {...inputLayout}>
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
              <Col {...buttonLayout}>
                <Form.Item>
                  <Button type="primary" htmlType="submit"
                          style={{float: "right"}}
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
              pageSize: this.state.limited,
              showQuickJumper: true,
              hideOnSinglePage: true,
              onChange: this.onPageChange,
            }}
          />
          <EditFormInModal
            visible={this.state.showEditModal}
            record={this.state.currentRecord}
            editColor={this.state.editColor}
            onCreate={this.onEdit}
            onCancel={this.onHideEditModal}
            colorChange={this.colorChange}
          />
          <DeleteModal
            visible={this.state.showDeleteModal}
            record={this.state.currentRecord}
            loading={this.state.deleteLoading}
            onOk={this.onDelete.bind(this, this.state.currentRecord.id)}
            onCancel={this.onHideDeleteModal}
          />
        </Card>
      </>
    );
  }
}


const EditFormInModal = ({visible, record, editColor, onCreate, onCancel, colorChange}) => {
  const [form] = Form.useForm();

  const handleColorChange = (c, event) => {
    colorChange(c.hex);
    form.setFieldsValue({
      color: c.hex
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      name: record.name,
      color: record.color,
    });
  });

  return (
    <Modal
      title="修改分类"
      visible={visible}
      forceRender={true}
      destroyOnClose={false}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
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
          <Button type="dashed" block style={{backgroundColor: editColor}}/>
          <ChromePicker color={editColor} onChangeComplete={handleColorChange}
                        style={{marginTop: 20}}/>
        </Form.Item>
      </Form>
    </Modal>
  )
};

const DeleteModal = ({visible, loading, record, onOk, onCancel}) => {

  return (
    <Modal
      title="确认是否要删除该分类"
      visible={visible}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={onOk}
    >
      {"分类：" + record.name}
    </Modal>
  )
};

export default AdminCategories;