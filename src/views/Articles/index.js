import React, {Component} from 'react';
import {Card, Table, Tooltip, Tag, Button, List} from "antd";
import moment from "moment";

import {getArticleList} from "../../api/articles";


class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: [],
      total: 0,
      offset: 0,
      limited: 20,
    }
  }

  componentDidMount() {
    this.getData();
  }


  getData = () => {
    this.setState({
      isLoading: true
    });
    getArticleList({offset: this.state.offset, limited: this.state.limited}).then(resp => {
      this.setState({
        dataSource: resp.results,
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
        <List
          itemLayout="vertical"
          size="middle"
          pagination={{
            onChange: this.onPageChange,
            pageSize: this.state.limited,
            showQuickJumper: true,
            current: this.state.offset / this.state.limited + 1,
            defaultCurrent: 1,
            hideOnSinglePage: true,
          }}
          dataSource={this.state.dataSource}
          renderItem={item => {
            return (
              <List.Item
                key={item.id}
                actions={[
                  <span>阅读量: <Tag color="blue">{item.amount}</Tag></span>,
                  <span>分类: <Tag color={item.category.color}>{item.category.name}</Tag></span>,
                  <span>标签: {item.tag.map(tag => {
                    return (<Tag color={tag.color}>{tag.name}</Tag>)
                  })}</span>
                ]}
              >
                <List.Item.Meta
                  title={<a href={`/article/${item.id}/`}>{item.title}</a>}
                  description={<span>发布于: {moment(item.created_time).format("LL")}</span>}
                />
                {item.desc}
              </List.Item>
            )
          }}
        >

        </List>
      </Card>
    );
  }
}

export default Article;