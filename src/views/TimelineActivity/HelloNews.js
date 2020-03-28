import React, {Component} from 'react';
import {Tag, List, Spin} from "antd";
import moment from "moment";

import {getHelloNewsList} from "../../api/news";


class HelloNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: [],
      total: 0,
      offset: 0,
      limited: 10,
    }
  }

  componentDidMount() {
    this.getData();
  }


  getData = () => {
    this.setState({
      isLoading: true
    });
    getHelloNewsList({offset: this.state.offset, limited: this.state.limited}).then(resp => {
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

  onPageChange = page => {
    this.setState({
      offset: (page - 1) * this.state.limited,
    }, () => {
      this.getData();
    });
  };


  toWriteArticle = () => {
    this.props.history.push("/activity/add")
  };

  render() {
    return (
      <Spin spinning={this.state.isLoading} size="large" tip="加载资讯中...">
        <List
          itemLayout="vertical"
          size="middle"
          pagination={{
            onChange: this.onPageChange,
            pageSize: this.state.limited,
            total: this.state.total,
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
                  <span>分类: <Tag color={item.category.color}>{item.category.name}</Tag></span>,
                  <span>组合: {item.group.map(g => {
                    return (<Tag color={g.color} key={g.id}>{g.name_jp}</Tag>)
                  })}</span>,
                  <span>成员: {item.member.map(m => {
                    return (<Tag color={m.color} key={m.id}>{m.name_jp}></Tag>)
                  })}</span>
                ]}
              >
                <List.Item.Meta
                  title={<a href={`/activity/${item.id}`} target="_blank" rel="noopener noreferrer">{item.title}</a>}
                description={<>
                <span>{moment(item.created_date).format("LL")}</span></>}
                />
                {item.desc}
              </List.Item>
            )
          }}
        />
      </Spin>
    );
  }
}

export default HelloNews;