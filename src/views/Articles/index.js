import React, {Component} from 'react';
import {Card, Table, Tooltip, Tag, Button} from "antd";
import moment from "moment";

import {getArticleList, getArticleById} from "../../api/articles";

const displayTitle = {
  "title": "标题",
  "desc": "摘要",
  "category": "分类",
  "tag": "标签",
  "owner": "作者",
  "amount": "阅读量",
  "created_time": "创建时间"
};

class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: [],
      columns: [],
      total: 0,
      offset: 0,
      limited: 20,
    }
  }

  componentDidMount() {
    this.getData();
  }

  createColumns = (columnKeys) => {
    const columns = columnKeys.map(item => {
      if (item === "amount") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          render: (text, record) => {
            const {amount} = record;
            // 这里根据数字大小做条件渲染
            // 同理可以做职位级别不同的颜色
            return <Tooltip title={"大于200标红"}>
              <Tag color={amount > 200 ? "red" : "green"}>{amount}</Tag>
            </Tooltip>
          }
        }
      } else if (item === "created_time") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          render: (text, record) => {
            return moment(record.created_time).format('LL');
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

  getData = () => {
    this.setState({
      isLoading: true
    });
    const columns = this.createColumns(["title", "desc", "category", "owner", "tag",
      "amount", "created_time"]);
    getArticleList({offset: this.state.offset, limited: this.state.limited}).then(resp => {
      this.setState({
        dataSource: resp.results,
        columns,
        total: resp.count,
      })
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  onPageChange = () => {

  };


  toWriteArticle = () => {
    this.props.history.push("/article/add")
  };

  render() {
    return (
      <Card title="文章列表" bordered={false}
            extra={<Button onClick={this.toWriteArticle}>编写文章</Button>}>
        <Table
          rowKey={record => record.id}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          loading={this.state.isLoading}
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

export default Article;