import React, {Component} from 'react';
import {Card, message, PageHeader, Row, Col, Tag, Divider} from "antd";
import "braft-editor/dist/output.css";

import {getHelloNewsById} from "../../api/news";

const layoutShort = {
  xs: 24, sm: 24, md: 12, lg: 12
};

class HelloNewsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      news: {
        title: "",
        category: [],
        group: [],
        member: [],
        content: "",
        id: 0,
      }
    }
  }

  componentDidMount() {
    this.getData(this.props.match.params.id);
  }

  getData = id => {
    this.setState({
      isLoading: true,
    });

    getHelloNewsById(id).then(resp => {
      this.setState({
        news: resp
      })
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  render() {
    const {news} = this.state;
    return (
      <div>
        <PageHeader
          className="site-page-header"
          onBack={() => {
            this.props.history.push("/activity");
          }}
          title="返回资讯列表"
          style={{backgroundColor: "#fff"}}
        >
        </PageHeader>
        <Card
          loading={this.state.isLoading}
          title={this.state.news.title}
          bordered={false}
          style={{marginTop: 10}}
          extra={<span>分类: <Tag color={news.category.color}>{news.category.name}</Tag></span>}
        >
          <Row>
            <Col {...layoutShort}>
              <span>组合: {news.group.map(item => {
                return (<Tag color={item.color} key={item.id}>{item.name_jp}</Tag> )
              })}</span>
            </Col>
            <Col {...layoutShort}>
              <span>成员: {news.member.map(item => {
                return (<Tag color={item.color} key={item.id}>{item.name_jp}</Tag> )
              })}</span>
            </Col>
          </Row>
          <Row>
            <Divider>内容</Divider>
            <div className="braft-output-content" dangerouslySetInnerHTML={{
              __html: news.content
            }} />
          </Row>
        </Card>
      </div>
    );
  }
}

export default HelloNewsDetail;