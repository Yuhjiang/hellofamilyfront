import React, {Component} from 'react';
import {Avatar, Card, Divider, Tag, Row, Col, Button, PageHeader} from "antd";
import moment from "moment";
import {connect} from "react-redux";
import "braft-editor/dist/output.css";

import {getArticleById} from "../../api/articles";
import CommentList from "./CommentList";
import AddComment from "./AddComment";
import {setArticle, getComments} from "../../actions/comment";

const mapStateToProps = state => {
  return {
    offset: state.comment.offset,
    limited: state.comment.limited,
  }
};

const layoutShort = {
  xs: 12, sm: 12, md: 4, lg: 4
};

const layoutLong = {
  xs: 24, sm: 12, md: 10, lg: 10
};

@connect(mapStateToProps, {setArticle, getComments})
class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      article: {
        title: "",
        desc: "",
        content: "",
        createdTime: "",
        updatedTime: "",
        owner: {id: 0},
        category: "",
        tags: [],
        id: 0,
      },
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
          updatedTime: resp.updated_time,
          category: resp.category,
          tags: resp.tag,
          amount: resp.amount,
          id: resp.id
        }
      });
      this.props.setArticle({postId: resp.id, ownerId: resp.owner.id});
      this.props.getComments({
        offset: this.props.offset, limited: this.props.limited, status: 1, post_id: resp.id
      })
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  onClickEditArticle = () => {
    this.props.history.push(`/article/edit/${this.props.match.params.id}`)
  };

  render() {
    const article = this.state.article;
    return (
      <>
        <PageHeader
          className="site-page-header"
          onBack={() => {
            this.props.history.push("/article");
          }}
          title="返回文章列表"
          style={{backgroundColor: "#fff"}}
        >
        </PageHeader>
        <Card
          loading={this.state.isLoading}
          title={article.title}
          style={{marginTop: 10}}
          extra={(<Button onClick={this.onClickEditArticle}>编辑</Button>)}
        >
          <Row align="middle">
            <Col>
              <Avatar src={article.owner.avatar}
                      size={64}/>
            </Col>
            <Col span={20}>
              <Row>
                <Col {...layoutShort}>
                  <span style={{fontSize: "1.2em"}}><b>{article.owner.nickname}</b></span>
                </Col>
                <Col {...layoutLong}>
                  <span>创建时间: {article.createdTime ? moment(article.createdTime).format("LLL") : ""}</span>
                </Col>
                <Col {...layoutLong}>
                  {article.updatedTime ? <span>更新时间: {moment(article.updatedTime).format("LLL")}</span> : ""}
                </Col>
              </Row>
              <Row>
                <Col {...layoutShort}>
                  <span>阅读量: <Tag
                    color={article.amount > 200 ? "red" : "green"}>{article.amount}</Tag></span>
                </Col>
                <Col {...layoutLong}>
                  <span>分类: <Tag color={article.category.color}>{article.category.name}</Tag></span>
                </Col>
                <Col {...layoutLong}>
                <span>标签: {article.tags.map((tag, idx) => {
                  return (<Tag color={tag.color} key={idx}>{tag.name}</Tag>)
                })}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider>正文</Divider>
          <div className="braft-output-content" dangerouslySetInnerHTML={{
            __html: article.content
          }}/>
        </Card>
        <AddComment />
        <CommentList />
      </>
    );
  }
}

export default ArticleDetail;