import React, {Component} from 'react';
import {Card, Table, Button, Modal, Tag, Typography, message} from "antd";
import moment from "moment";

import {getArticleList, deleteArticle} from "../../api/articles";

const {Paragraph} = Typography;

const displayTitle = {
  "title": "标题",
  "owner": "作者",
  "desc": "摘要",
  "amount": "阅读量",
  "createdTime": "创建时间",
};

class AdminArticles extends Component {
  constructor(props) {
    super(props);
    const columns = this.createColumns(["title", "owner", "desc", "amount",
      "createdTime"]);
    this.state = {
      offset: 0,
      limited: 5,
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

    getArticleList({offset: offset, limited: limited}).then(resp => {
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

    deleteArticle(this.state.currentRecord.id).then(resp => {
      message.success("成功删除文章");
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
      if (item === "amount") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (
              <Tag color={record.amount >= 10 ? "red" : "green"}>{record.amount}</Tag>
            )
          }
        }
      } else if (item === "createdTime") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: "created_time",
          align: "center",
          render: (text, record) => {
            return moment(record.created_time).format("LL");
          }
        }
      } else if (item === "desc") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return <Paragraph ellipsis={{rows: 1, expandable: true}}>{record.desc}</Paragraph>;
          }
        }
      } else if (item === "title") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (<a href={`/article/${record.id}`} style={{color: "#000"}}>{record.title}</a>)
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
            showQuickJumper: true,
            hideOnSinglePage: true,
            onChange: this.onPageChange,
          }}
        />
        <Modal
          title="确认是否删除此篇文章"
          visible={this.state.deleteModalVisible}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <div>{"作者： " + this.state.currentRecord.owner}</div>
          <div>{"文章标题: " + this.state.currentRecord.title}</div>
        </Modal>
      </Card>
    );
  }
}

export default AdminArticles;