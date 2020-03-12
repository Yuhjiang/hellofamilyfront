import React, {Component, useEffect} from 'react';
import {Button, Card, Form, Input, Row, Col, Table, Modal, message} from "antd";
import moment from "moment";

import {createCarousel, editCarousel, deleteCarousel, getCarouselList} from "../../api/pictures";

const buttonLayout = {
  xs: 24, sm: 24, md: 4, lg: 4
};

const inputLayout = {
  xs: 24, sm: 24, md: 10, lg: 10
};


const displayTitle = {
  "name": "图片描述",
  "image": "图片链接",
  "status": "状态",
  "created_time": "添加时间",
};

class AdminCarousel extends Component {
  constructor(props) {
    super(props);
    const columns = this.createColumns(["name", "image", "status", "created_time"]);
    this.state = {
      addLoading: false,
      dataSource: [],
      columns: columns,
      offset: 0,
      limited: 10,
      isLoading: false,
      total: 0,
      showDeleteModal: false,
      showEditModal: false,
      currentRecord: {
        name: "",
        image: "",
        id: 0,
      },
      deleteLoading: false,
    }
  }

  formRef = React.createRef();

  componentDidMount() {
    this.getData(0, this.state.limited);
  }

  getData = (offset, limited) => {
    this.setState({
      isLoading: true,
    });

    getCarouselList({offset, limited}).then(resp => {
      this.setState({
        dataSource: resp.results,
        total: resp.total,
      })
    }).catch(err => {
      message.error("获取失败");
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  onClickEditButton = record => {
    this.setState({
      showEditModal: true,
      currentRecord: record,
    })
  };

  onClickDeleteButton = record => {
    this.setState({
      showDeleteModal: true,
      currentRecord: record,
    })
  };

  createColumns = columnKeys => {
    const columns = columnKeys.map(item => {
      if (item === "created_time") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (moment(record.created_time).format("LL"));
          }
        }
      } else {
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

  resetForm = () => {
    this.formRef.current.setFieldsValue({
      name: "",
      image: "",
    });
  };

  onFinish = values => {
    this.setState({
      addLoading: true,
    });

    createCarousel(values).then(resp => {
      message.success("成功添加图片");
      this.getData(0, this.state.limited);
    }).catch(err => {
      message.error("添加失败");
    }).finally(() => {
      this.setState({
        addLoading: false,
      });
      this.resetForm();
    })
  };

  onFinishFailed = errors => {

  };

  onPageChange = page => {

  };

  onDelete = id => {
    this.setState({
      deleteLoading: true
    });

    deleteCarousel(id).then(resp => {
      message.success("成功删除图片");
      this.onHideDeleteModal();
      this.getData();
    }).catch(err => {
      message.error(err)
    }).finally(() => {
      this.setState({
        deleteLoading: false,
      })
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

  onEdit = (id, values) => {
    editCarousel(id, values).then(resp => {
      message.success("成功修改图片");
      this.onHideEditModal();
      this.getData(0, this.state.limited);
    }).catch(err => {
      message.error(err);
    })
  };

  render() {
    return (
      <>
        <Card
          title="添加走马灯图片"
          style={{marginTop: 10}}
        >
          <Form
            name="addCarousel"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
          >
            <Row>
              <Col {...inputLayout}>
                <Form.Item
                  label="图片描述"
                  name="name"
                  wrapperCol={{span: 16}}
                  rules={[
                    {required: true, message: "请输入图片描述"}
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col {...inputLayout}>
                <Form.Item
                  label="图片链接"
                  name="image"
                  wrapperCol={{span: 16}}
                  rules={[
                    {required: true, message: "请输入图片链接"},
                    {type: "url", message: "请输入正确的链接"}
                  ]}
                >
                  <Input/>
                </Form.Item>
              </Col>
              <Col {...buttonLayout}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{float: "right"}}
                    loading={this.state.addLoading}
                  >确定</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          title="走马灯图片列表"
          style={{marginTop: 10}}
        >
          <Table
            rowKey={record => record.id}
            dataSource={this.state.dataSource}
            columns={this.state.columns}
            loading={this.state.isLoading}
            pagination={{
              current: this.state.offset / this.state.limited + 1,
              pageSize: this.state.limited,
              total: this.state.total,
              showQuickJumper: true,
              hideOnSinglePage: true,
              onChange: this.onPageChange,
            }}
          />
          <DeleteModal
            visible={this.state.showDeleteModal}
            loading={this.state.deleteLoading}
            record={this.state.currentRecord}
            onOk={this.onDelete.bind(this, this.state.currentRecord.id)}
            onCancel={this.onHideDeleteModal}
          />
          <EditModal
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


const DeleteModal = ({visible, loading, record, onOk, onCancel}) => {
  return (
    <Modal
      title="确认是否要删除该图片"
      visible={visible}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={onOk}
    >
      {record.name + ": " + record.image}
    </Modal>
  )
};

const EditModal = ({visible, record, onCreate, onCancel}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: record.name,
      image: record.image,
    });
  });

  return (
    <Modal
      title="修改图片"
      visible={visible}
      forceRender={true}
      destroyOnClose={false}
      onOk={() => {
        form.validateFields().then(values => {
          form.resetFields();
          onCreate(record.id, values);
        }).catch(info => {
          console.log('Validate Failed:', info);
        })
      }}
      onCancel={onCancel}
    >
      <Form
        name="editCarousel"
        form={form}
      >
        <Form.Item
          label="图片描述"
          name="name"
          wrapperCol={{span: 16}}
          rules={[
            {required: true, message: "请输入图片描述"}
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="图片链接"
          name="image"
          wrapperCol={{span: 16}}
          rules={[
            {required: true, message: "请输入图片链接"},
            {type: "url", message: "请输入正确的链接"}
          ]}
        >
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default AdminCarousel;