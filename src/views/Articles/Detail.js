import React, {Component} from 'react';
import {Card, Descriptions, Tag} from "antd";
import moment from "moment";
import "braft-editor/dist/output.css";

import {getArticleById} from "../../api/articles";

class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      article: {
        title: '',
        desc: '',
        content: '',
        createdTime: '',
        owner: '',
        category: '',
        tags: [],
      }
    };
  }

  componentDidMount() {
    this.getData(this.props.match.params.id);
  }

  getData = (id) => {
    this.setState({
      isLoading: true,
    });

    getArticleById(id).then(resp => {
      this.setState({
        article: {
          title: resp.title,
          owner: resp.owner,
          desc: resp.desc,
          content: resp.content,
          createdTime: resp.created_time,
          category: resp.category,
          tags: resp.tag,
          amount: resp.amount,
        }
      })
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  render() {
    const article = this.state.article;
    return (
      <Card loading={this.state.isLoading} title={article.title}>
        <Descriptions>
          <Descriptions.Item label="作者">{article.owner}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {article.createdTime ? moment(article.createdTime).format("LL") : ""}
          </Descriptions.Item>
          <Descriptions.Item label="阅读量">
            <Tag color={article.amount > 200 ? "red" : "green"}>
              {article.amount}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="分类"><Tag color="green">{article.category}</Tag></Descriptions.Item>
          <Descriptions.Item label="标签">
            {article.tags.map((tag, idx) => {
              return (<Tag color="blue" key={idx}>{tag}</Tag>)
            })}
          </Descriptions.Item>
        </Descriptions>
        <div className="braft-output-content" dangerouslySetInnerHTML={{
          __html: article.content
        }} />
      </Card>
    );
  }
}

export default ArticleDetail;