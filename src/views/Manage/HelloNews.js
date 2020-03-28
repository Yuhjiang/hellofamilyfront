import React, {Component} from 'react';
import {Card, Table, Button, Modal, Tag, message} from "antd";
import moment from "moment";

import {getHelloNewsList, deleteHelloNews} from "../../api/news";

const displayTitle = {
  "title": "标题",
  "category": "分类",
  "group": "组合",
  "member": "成员",
  "created_date": "创建时间",
};

class AdminArticles extends Component {
  constructor(props) {
    super(props);
    const columns = this.createColumns(["title", "category", "group", "member",
      "created_date"]);
    this.state = {
      offset: 0,
      limited: 10,
      total: 0,
      dataSource: [],
      columns: columns,
      isLoading: false,
      deleteModalVisible: false,
      confirmLoading: false,
      currentRecord: {
        title: "",
        owner: ""
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

    getHelloNewsList({offset: offset, limited: limited}).then(resp => {
      this.setState({
        dataSource: resp.results,
        total: resp.count,
      })
    }).catch(err => {
      message.error("获取失败");
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  onClickDeleteButton = record => {
    this.setState({
      deleteModalVisible: true,
      currentRecord: record,
    })
  };

  onCancel = () => {
    this.setState({
      deleteModalVisible: false,
    })
  };

  onOk = () => {
    this.setState({
      confirmLoading: true,
    });

    deleteHelloNews(this.state.currentRecord.id).then(resp => {
      message.success("成功删除资讯");
      this.getData(0, this.state.limited);
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        confirmLoading: false,
        deleteModalVisible: false,
      })
    })
  };

  createColumns = columnKeys => {
    const columns = columnKeys.map(item => {
      if (item === "group") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (
              record.group.map(item => {
                return (<Tag color={item.color} key={item.id}>{item.name_jp}</Tag>)
              })
            )
          }
        }
      } else if (item === "member") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (
              record.member.map(item => {
                return (<Tag color={item.color} key={item.id}>{item.name_jp}</Tag>)
              })
            )
          }
        }
      } else if (item === "category") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            console.log(text);
            return (
              <Tag color={text.color} key={text.id}>{text.name}</Tag>
            )
          }
        }
      } else if (item === "created_date") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: "created_date",
          align: "center",
          width: 200,
          render: (text, record) => {
            return moment(record.created_time).format("LL");
          }
        }
      } else if (item === "title") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          render: (text, record) => {
            return (<a href={`/activity/${record.id}`} style={{color: "#000"}}>{record.title}</a>)
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
      render: (text, record) => {
        return (
          <Button
            size="small" danger
            onClick={this.onClickDeleteButton.bind(this, record)}>
            删除
          </Button>)
      }
    });
    return columns;
  };

  onPageChange = page => {
    this.setState({
      offset: (page - 1) * this.state.limited,
    }, () => {
      this.getData(this.state.offset, this.state.limited);
    });
  };

  render() {
    return (
      <Card
        title="文章列表"
        bordered={false}
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
        <Modal
          title="确认是否删除此篇资讯"
          visible={this.state.deleteModalVisible}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <div>{"标题: " + this.state.currentRecord.title}</div>
        </Modal>
      </Card>
    );
  }
}

export default AdminArticles;