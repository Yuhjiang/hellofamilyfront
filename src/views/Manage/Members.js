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
  Collapse,
  message
} from "antd";
import {ChromePicker} from "react-color";
import moment from "moment";

import {
  getMembers,
  createMember,
  editMember,
  deleteMember,
  getAllGroups, getMemberById
} from "../../api/pictures";
import {getColumnSearchProps, getColumnDateSearchProps} from "../../utils";

const {Option} = Select;
const {Panel} = Collapse;

const basicLayout = {
  xs: 12, sm: 12, md: 6, lg: 6
};

const modalLayout = {
  xs: 12, sm: 12, md: 12, lg: 12
};

const displayTitle = {
  "name_jp": "日文名",
  "name_en": "罗马音",
  "joined_time": "加入时间",
  "graduated_time": "毕业时间",
  "status": "状态",
  "color": "代表色",
  "group_names": "组合",
};

class AdminMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      color: "#fff",
      showAddColorModal: false,
      addLoading: false,
      columns: [],
      dataSource: [],
      page: 1,
      limited: 10,
      total: 0,
      showDeleteModal: false,
      showEditModal: false,
      currentRecord: {
        group: [],
      },
      editorColor: [],
      deleteLoading: false,
      groups: []
    };
  }

  formRef = React.createRef();

  componentDidMount() {
    const columns = this.createColumns(["name_jp", "name_en", "joined_time", "graduated_time", "status", "color", "group_names"]);
    this.setState({
      columns: columns
    });
    this.getData();
    this.getGroupList();
  }

  assembleParams = () => {
    const params = {
      page_size: this.state.limited,
      page: this.state.page,
    };
    const {searchText, searchedColumn, startDate, endDate} = this.state;
    if (searchText && searchedColumn) {
      params[searchedColumn] = searchText;
    }
    if (startDate && endDate) {
      params['start_date'] = startDate;
      params['end_date'] = endDate;
    }

    return params;
  };

  getGroupList = () => {
    getAllGroups().then(resp => {
      this.setState({
        groups: resp,
      })
    }).catch(err => {
      message.error(err);
    })
  };

  createColumns = columnKeys => {
    const columns = columnKeys.map(item => {
      if (item === "joined_time" || item === "graduated_time") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (<span>{record[item] ? moment(record[item]).format("LL") : "-"}</span>)
          },
          ...getColumnDateSearchProps(displayTitle, item, this.handleDateSearch, this.handleDateReset)
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
                <Tag color="green"><span>在籍</span></Tag>
                :
                <Tag color="red"><span>毕业</span></Tag>
            )
          }
        }
      } else if (item === "color") {
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
      else if (item === "group_names") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            const {group_names} = record;
            let group = ""
            for (let i = 0; i < group_names.length; i++) {
              group += group_names[i]
              if (i < group_names.length-1) {
                group += ", "
              }
            }
            return group
          },
          ...getColumnSearchProps(displayTitle, item, this.searchInput, this.handleSearch, this.handleReset),
        }
      } else if (item === "name_jp" || item === "name_en") {
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

  getData = () => {
    this.setState({
      isLoading: true,
    });

    const params = this.assembleParams();
    getMembers(params).then(resp => {
      this.setState({
        dataSource: resp.results,
        total: resp.count,
      });
    }).catch(err => {
      message.error("获取成员失败");
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
      joined_time: values.joined_time.format("YYYY-MM-DD"),
      graduated_time: values.graduated_time ? values.graduated_time.format("YYYY-MM-DD") : undefined,
      birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : undefined,
    };

    createMember(newValues).then(resp => {
      message.success("成功添加成员");
      this.getData();
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
      page: page
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
    getMemberById(record.id).then(resp => {
      this.setState({
        showEditModal: true,
        currentRecord: record,
        editColor: record.color || "#fff",
      })
    }).catch(err => {
      message.error("获取失败")
    })
  };

  onDelete = id => {
    this.setState({
      deleteLoading: true,
    });
    deleteMember(id).then(resp => {
      message.success("成功删除成员");
    }).catch(err => {
      message.error(err);
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

  onEdit = (id, values) => {
    const newData = {
      ...values,
      joined_time: values.joined_time.format("YYYY-MM-DD"),
      graduated_time: values.graduated_time ? values.graduated_time.format("YYYY-MM-DD") : undefined,
      birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : undefined,
    };

    editMember(id, newData).then(resp => {
      message.success("成功修改成员");
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.onHideEditModal();
      this.getData();
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

  handleDateSearch = (selectKeys, confirm, dataIndex) => {
    confirm();
    if (selectKeys.length === 2) {
      this.setState({
        startDate: selectKeys[0],
        endDate: selectKeys[1],
      })
    } else {
      this.setState({
        startDate: "",
        endDate: "",
      })
    }
  };

  handleDateReset = clearFilters => {
    clearFilters();
    this.setState({
      startDate: "",
      endDate: "",
    })
  };

  render() {
    return (
      <>
        <Card
          title="添加成员"
          style={{marginTop: 10}}
          extra={(
            <Button type="primary" htmlType="submit" form="addMember"
                    loading={this.state.addLoading}>
              确定
            </Button>
          )}
        >
          <Form
            name="editMember"
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
                    {required: true, message: "请输入成员中文名，不知道怎么翻译的话，填日文名"}
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
                    {required: true, message: "请输入成员日文名"}
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
                    {required: true, message: "请输入成员罗马名"}
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col {...basicLayout}>
                <Form.Item
                  label="所属组合"
                  name="group"
                  wrapperCol={{span: 14}}
                  rules={[
                    {required: true, message: "请选择成员所属组合"}
                  ]}
                >
                  <Select
                      mode="multiple"
                      allowClear
                  >
                    {this.state.groups.map(group => {
                      return (<Option value={group.id} key={group.id}>{group.name_jp}</Option>)
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col {...basicLayout}>
                <Form.Item
                  label="成员状态"
                  name="status"
                  wrapperCol={{span: 10}}
                  rules={[
                    {required: true, message: "请选择成员状态"}
                  ]}
                >
                  <Select>
                    <Option value={1} key={1}>在籍</Option>
                    <Option value={0} key={0}>毕业</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col {...basicLayout}>
                <Form.Item
                  label="加入时间"
                  name="joined_time"
                  wrapperCol={{span: 14}}
                  rules={[
                    {required: true, message: "请选择加入时间"}
                  ]}
                >
                  <DatePicker/>
                </Form.Item>
              </Col>
              <Col {...basicLayout}>
                <Form.Item
                  label="毕业时间"
                  name="graduated_time"
                  wrapperCol={{span: 16}}
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
            </Row>
            <Collapse>
              <Panel header="额外信息" key="1">
                <Row>
                  <Col {...basicLayout}>
                    <Form.Item
                      label="家乡"
                      name="hometown"
                      wrapperCol={{span: 16}}
                    >
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col {...basicLayout}>
                    <Form.Item
                      label="昵称"
                      name="nickname"
                      wrapperCol={{span: 16}}
                    >
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col {...basicLayout}>
                    <Form.Item
                      label="生日"
                      name="birthday"
                      wrapperCol={{span: 16}}
                    >
                      <DatePicker/>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="图片"
                      name="favicon"
                      wrapperCol={{span: 20}}
                      rules={[
                        {type: "url", message: "请输入合理的图片地址"}
                      ]}
                    >
                      <Input placeholder="此图片会自动用于注册人脸"/>
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Form>
        </Card>
        <Card
          title="成员列表"
          style={{marginTop: 10}}
        >
          <Table
            rowKey={record => record.id}
            dataSource={this.state.dataSource}
            columns={this.state.columns}
            loading={this.state.isLoading}
            bordered
            pagination={{
              current: this.state.page,
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
            groups={this.state.groups}
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
      title="确实是否要删除成员"
      visible={visible}
      coonfirmLoading={loading}
      onCancel={onCancel}
      onOk={onOk}
    >
      {"成员名：" + record.name_jp}
    </Modal>
  )
};

const EditFormInModal = ({visible, record, editColor, onCreate, onCancel, colorChange, groups}) => {
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
      group: record.group,
      joined_time: record.joined_time ? moment(record.joined_time) : undefined,
      graduated_time: record.graduated_time ? moment(record.graduated_time) : undefined,
      birthday: record.birthday ? moment(record.birthday) : undefined,
      color: record.color || "#fff",
    });
  });

  return (
    <Modal
      title="修改成员信息"
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
        name="addMember"
        form={form}
      >
        <Row>
          <Col {...modalLayout}>
            <Form.Item
              label="中文名"
              name="name"
              wrapperCol={{span: 16}}
              rules={[
                {required: true, message: "请输入成员中文名，不知道怎么翻译的话，填日文名"}
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
                {required: true, message: "请输入成员日文名"}
              ]}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col {...modalLayout}>
            <Form.Item
              label="罗马音"
              name="name_en"
              wrapperCol={{span: 16}}
              rules={[
                {required: true, message: "请输入成员罗马名"}
              ]}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col {...modalLayout}>
            <Form.Item
              label="所属组合"
              name="group"
              wrapperCol={{span: 14}}
              rules={[
                {required: true, message: "请选择成员所属组合"}
              ]}
            >
              <Select
                  mode="multiple"
                  allowClear
              >
                {groups.map(group => {
                  return (<Option value={group.id} key={group.id}>{group.name_jp}</Option>)
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...modalLayout}>
            <Form.Item
              label="成员状态"
              name="status"
              wrapperCol={{span: 10}}
              rules={[
                {required: true, message: "请选择成员状态"}
              ]}
            >
              <Select>
                <Option value={1} key={1}>在籍</Option>
                <Option value={0} key={0}>毕业</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col {...modalLayout}>
            <Form.Item
              label="加入时间"
              name="joined_time"
              wrapperCol={{span: 14}}
              rules={[
                {required: true, message: "请选择加入时间"}
              ]}
            >
              <DatePicker/>
            </Form.Item>
          </Col>
          <Col {...modalLayout}>
            <Form.Item
              label="毕业时间"
              name="graduated_time"
              wrapperCol={{span: 16}}
            >
              <DatePicker/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="代表色"
              name="color"
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
            <Col {...modalLayout}>
              <Form.Item
                label="家乡"
                name="hometown"
                wrapperCol={{span: 16}}
              >
                <Input/>
              </Form.Item>
            </Col>
            <Col {...modalLayout}>
              <Form.Item
                label="昵称"
                name="nickname"
                wrapperCol={{span: 16}}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...modalLayout}>
              <Form.Item
                label="生日"
                name="birthday"
                wrapperCol={{span: 16}}
              >
                <DatePicker/>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="图片"
                name="favicon"
                wrapperCol={{span: 20}}
                rules={[
                  {type: "url", message: "请输入合理的图片地址"}
                ]}
              >
                <Input placeholder="此图片会自动用于注册人脸"/>
              </Form.Item>
            </Col>
          </Row>
      </Form>
    </Modal>
  )
};

export default AdminMembers;