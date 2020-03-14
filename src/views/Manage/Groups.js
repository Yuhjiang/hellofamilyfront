import React, {Component, useEffect} from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
  Table,
  Modal,
  Select,
  Tag,
  DatePicker,
  message
} from "antd";
import {ChromePicker} from "react-color";
import moment from "moment";

import {getGroups, createGroup, deleteGroup, editGroup} from "../../api/pictures";

const {Option} = Select;
const basicLayout = {
  xs: 12, sm: 12, md: 8, lg: 8
};
const urlLayout = {
  xs: 24, sm: 24, md: 12, lg: 12
};

const modalLayout = {
  xs: 12, sm: 12, md: 12, lg: 12
};

const displayTitle = {
  "name_jp": "日文名",
  "name_en": "罗马音",
  "created_time": "成立时间",
  "status": "状态",
  "color": "代表色",
};

class AdminGroups extends Component {
  constructor(props) {
    super(props);
    const columns = this.createColumns(["name_jp", "name_en", "created_time", "status", "color"]);
    this.state = {
      isLoading: false,
      color: "#fff",
      showAddColorModal: false,
      addLoading: false,
      columns: columns,
      dataSource: [],
      offset: 0,
      limited: 10,
      total: 0,
      showDeleteModal: false,
      showEditModal: false,
      currentRecord: {},
      editorColor: [],
      deleteLoading: false,
    }
  }

  formRef = React.createRef();

  componentDidMount() {
    this.getData(0, this.state.limited);
  }

  createColumns = columnKeys => {
    const columns = columnKeys.map(item => {
      if (item === "created_time") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (<span>{moment(record.created_time).format("LL")}</span>)
          }
        }
      } else if (item === "status") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (
              record.status
                ?
                <Tag color="green"><span>正常</span></Tag>
                :
                <Tag color="red"><span>解散</span></Tag>
            )
          }
        }
      }
      else if (item === "color") {
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

  getData = (offset, limited) => {
    this.setState({
      isLoading: true,
    });
    getGroups({offset, limited, order: "-id"}).then(resp => {
      this.setState({
        dataSource: resp.results,
        total: resp.count,
      });
    }).catch(err => {
      message.error("获取组合失败");
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  onFinish = values => {
    this.setState({
      addLoading: true,
    });
    const newValues = {
      ...values,
      created_time: values.created_time.format("YYYY-MM-DD"),
    };

    createGroup(newValues).then(resp => {
      message.success("成功添加组合");
      this.getData(0, this.state.limited);
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        addLoading: false
      })
    })
  };

  onFinishFailed = errors => {

  };

  showAddColorModal = () => {
    this.setState({
      showAddColorModal: true,
    })
  };

  hideAddColorModal = () => {
    this.setState({
      showAddColorModal: false,
    })
  };

  handleColorChange = (color, event) => {
    this.setState({
      color: color.hex,
    });
    this.formRef.current.setFieldsValue({
      color: color.hex
    })
  };

  onPageChange = page => {
    this.setState({
      offset: (page - 1) * this.state.limited,
    }, () => {
      this.getData(this.state.offset, this.state.limited);
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

  onDelete = id => {
    this.setState({
      deleteLoading: true,
    });
    deleteGroup(id).then(resp => {
      message.success("成功删除组合");
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        deleteLoading: false,
        showDeleteModal: false,
      });
      this.getData(0, this.state.limited);
    })
  };

  onHideDeleteModal = () => {
    this.setState({
      showDeleteModal: false,
    })
  };

  onHideEditModal = () => {
    this.setState({
      showEditModal: false,
    })
  };

  colorChange = (color) => {
    this.setState({
      editColor: color,
    })
  };

  onEdit = (id, data) => {
    const newData = {
      ...data,
      created_time: data.created_time.format("YYYY-MM-DD")
    };

    editGroup(id, newData).then(resp => {
      message.success("成功修改组合");
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.onHideEditModal();
      this.getData(0, this.state.limited);
    })
  };

  render() {
    return (
      <>
        <Card
          title="添加组合"
          style={{marginTop: 10}}
          extra={(
            <Button type="primary" htmlType="submit" form="addGroup"
                    loading={this.state.addLoading}>
              确定
            </Button>
          )}
        >
          <Form
            name="addGroup"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
          >
            <Row>
              <Col {...basicLayout}>
                <Form.Item
                  label="中文名"
                  name="name"
                  wrapperCol={{span: 16}}
                  rules={[
                    {required: true, message: "请输入组合中文名"}
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col {...basicLayout}>
                <Form.Item
                  label="日文名"
                  name="name_jp"
                  wrapperCol={{span: 16}}
                  rules={[
                    {required: true, message: "请输入组合日文名"}
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col {...basicLayout}>
                <Form.Item
                  label="罗马音"
                  name="name_en"
                  wrapperCol={{span: 16}}
                  rules={[
                    {required: true, message: "请输入组合罗马名"}
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col {...basicLayout}>
                <Form.Item
                  label="组合状态"
                  name="status"
                  wrapperCol={{span: 10}}
                  rules={[
                    {required: true, message: "请选择组合状态"}
                  ]}
                >
                  <Select>
                    <Option value={1} key={1}>正常</Option>
                    <Option value={0} key={0}>解散</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col {...basicLayout}>
                <Form.Item
                  label="成立时间"
                  name="created_time"
                  wrapperCol={{span: 16}}
                  rules={[
                    {required: true, message: "请选择成立时间"}
                  ]}
                >
                  <DatePicker/>
                </Form.Item>
              </Col>
              <Col {...basicLayout}>
                <Form.Item
                  label="代表色"
                  name="color"
                  wrapperCol={{span: 16}}
                  rules={[
                    {required: true, message: "请选择代表色"}
                  ]}
                >
                  <Button
                    onClick={this.showAddColorModal}
                    type="dashed"
                    block
                    style={{backgroundColor: this.state.color}}
                  >
                    选择颜色
                  </Button>
                  <Modal
                    title="选择颜色"
                    visible={this.state.showAddColorModal}
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
              <Col {...urlLayout}>
                <Form.Item
                  label="主页"
                  name="homepage"
                  wrapperCol={{span: 20}}
                  rules={[
                    {type: "url", message: "请输入合理的地址"}
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col {...urlLayout}>
                <Form.Item
                  label="图片"
                  name="favicon"
                  wrapperCol={{span: 20}}
                  rules={[
                    {required: true, message: "请输入图片地址"},
                    {type: "url", message: "请输入合理的图片地址"}
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          title="组合列表"
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
            confirmLoading={this.state.deleteLoading}
            onOk={this.onDelete.bind(this, this.state.currentRecord.id)}
            onCancel={this.onHideDeleteModal}
          />
        </Card>
      </>
    );
  }
}

const DeleteModal = ({visible, loading, record, onOk, onCancel}) => {

  return (
    <Modal
      title="确实是否要删除组合"
      visible={visible}
      coonfirmLoading={loading}
      onCancel={onCancel}
      onOk={onOk}
    >
      {"组合名：" + record.name_jp}
    </Modal>
  )
};

const EditFormInModal = ({visible, record, editColor, onCreate, onCancel, colorChange}) => {
  const [form] = Form.useForm();

  const handleColorChange = (c, event) => {
    colorChange(c ? c.hex : "#fff");
    form.setFieldsValue({
      color: c ? c.hex : "#fff",
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...record,
      created_time: moment(record.created_time),
    });
  });

  return (
    <Modal
      title="修改组合信息"
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
        name="editGroup"
        form={form}
      >
        <Row>
          <Col {...modalLayout}>
            <Form.Item
              label="中文名"
              name="name"
              wrapperCol={{span: 16}}
              rules={[
                {required: true, message: "请输入组合中文名"}
              ]}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col {...modalLayout}>
            <Form.Item
              label="日文名"
              name="name_jp"
              wrapperCol={{span: 16}}
              rules={[
                {required: true, message: "请输入组合日文名"}
              ]}
            >
              <Input/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...modalLayout}>
            <Form.Item
              label="罗马音"
              name="name_en"
              wrapperCol={{span: 16}}
              rules={[
                {required: true, message: "请输入组合罗马名"}
              ]}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col {...modalLayout}>
            <Form.Item
              label="组合状态"
              name="status"
              wrapperCol={{span: 10}}
              rules={[
                {required: true, message: "请选择组合状态"}
              ]}
            >
              <Select>
                <Option value={1} key={1}>正常</Option>
                <Option value={0} key={0}>解散</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="成立时间"
              name="created_time"
              wrapperCol={{span: 16}}
              rules={[
                {required: true, message: "请选择成立时间"}
              ]}
            >
              <DatePicker/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...modalLayout}>
            <Form.Item
              label="代表色"
              name="color"
              wrapperCol={{span: 16}}
              rules={[
                {required: true, message: "请选择代表色"}
              ]}
            >
              <Button
                type="dashed"
                block
                style={{backgroundColor: editColor}}
              >
                选择颜色
              </Button>
              <ChromePicker
                color={editColor}
                onChangeComplete={handleColorChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="主页"
              name="homepage"
              wrapperCol={{span: 20}}
              rules={[
                {type: "url", message: "请输入合理的地址"}
              ]}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="图片"
              name="favicon"
              wrapperCol={{span: 20}}
              rules={[
                {required: true, message: "请输入图片地址"},
                {type: "url", message: "请输入合理的图片地址"}
              ]}
            >
              <Input/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
};

export default AdminGroups;