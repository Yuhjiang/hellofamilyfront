import React, {Component} from 'react';
import {Card, Table, Button, Modal, Tag, Typography, message} from "antd";
import moment from "moment";

import {getArticleList} from "../../api/articles";

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

  createColumns = columnKeys => {
    const columns = columnKeys.map(item => {
      if (item === "amount") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
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
          render: (text, record) => {
            return moment(record.created_time).format("LL");
          }
        }
      } else if (item === "desc") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          render: (text, record) => {
            return <Paragraph ellipsis={{rows: 1, expandable: true}}>{record.desc}</Paragraph>;
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
        stlye={{marginTop: 10}}
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
      </Card>
    );
  }
}

export default AdminArticles;