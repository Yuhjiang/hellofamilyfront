import React, {Component} from 'react';
import {
  Card,
  Tag,
  Button,
  List,
  Avatar,
  Spin,
  Row,
  Col,
  Select,
  Input,
  message
} from "antd";
import moment from "moment";

import {getArticleList} from "../../api/articles";
import {getCategoryList, getTagList} from "../../api/articles"


const {Option} = Select;
const {Search} = Input;

const layout = {
  xs: 12, sm: 12, md: 6, lg: 6
};

class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: [],
      total: 0,
      offset: 0,
      limited: 10,
      categoryList: [],
      tagList: [],
      category: "",
      tag: "",
      title: "",
      nickname: "",
    }
  }

  componentDidMount() {
    this.getData();
    this.setCategoryList();
    this.setTagList();
  }


  getData = () => {
    this.setState({
      isLoading: true
    });

    const params = this.assembleParams();
    getArticleList(params).then(resp => {
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

  assembleParams = () => {
    const params = {
      offset: this.state.offset,
      limited: this.state.limited,
    };
    const {category, tag, title, nickname} = this.state;
    if (category) {
      params.category = category;
    }
    if (tag) {
      params.tag = tag;
    }
    if (title) {
      params.title = title;
    }
    if (nickname) {
      params.nickname = nickname;
    }
    return params;
  };

  onPageChange = page => {
    this.setState({
      offset: (page - 1) * this.state.limited,
    }, () => {
      this.getData();
    });
  };


  toWriteArticle = () => {
    this.props.history.push("/article/add");
  };

  setCategoryList = () => {
    getCategoryList({limited: 100}).then(resp => {
      this.setState({
        categoryList: resp.results,
      })
    }).catch(err => {
      message.error(err);
    })
  };

  onCategorySelect = category => {
    this.setState({
      category: category
    }, () => {
      this.getData();
    });
  };

  onCategoryChange = category => {
    if (category === undefined) {
      this.setState({
        category: category,
      }, () => {
        this.getData();
      })
    }
  };

  setTagList = () => {
    getTagList({limited: 100}).then(resp => {
      this.setState({
        tagList: resp.results,
      })
    }).catch(err => {
      message.error(err);
    })
  };

  onTagSelect = tag => {
    this.setState({
      tag: tag
    }, () => {
      this.getData();
    });
  };

  onTagChange = tag => {
    if (tag === undefined) {
      this.setState({
        tag: tag,
      }, () => {
        this.getData();
      })
    }
  };

  onNicknameSearch = nickname => {
    this.setState({
      nickname: nickname
    }, () => {
      this.getData();
    })
  };

  onTitleSearch = title => {
    this.setState({
      title: title
    }, () => {
      this.getData();
    })
  };

  render() {
    return (
      <>
        <Card title="文章列表" bordered={false}
              extra={<Button onClick={this.toWriteArticle}>编写文章</Button>}>
          <Row>
            <Col {...layout}>
              <Select
                placeholder="分类"
                allowClear={true}
                style={{width: "80%"}}
                onSelect={this.onCategorySelect}
                onChange={this.onCategoryChange}
              >
                {this.state.categoryList.map(item => (
                  <Option value={item.id} key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Col>
            <Col {...layout}>
              <Select
                placeholder="标签"
                allowClear={true}
                style={{width: "80%"}}
                onSelect={this.onTagSelect}
                onChange={this.onTagChange}
              >
                {this.state.tagList.map(item => (
                  <Option value={item.id} key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Col>
            <Col {...layout}>
              <Search
                allowClear={true}
                placeholder="输入作者昵称"
                style={{width: "80%"}}
                onSearch={this.onNicknameSearch}
              />
            </Col>
            <Col {...layout}>
              <Search
                allowClear={true}
                placeholder="输入文章标题"
                style={{width: "80%"}}
                onSearch={this.onTitleSearch}
              />
            </Col>
          </Row>
        </Card>
        <Card
          bordered={false}
          style={{marginTop: 10}}
        >
          <Spin spinning={this.state.isLoading} size="large" tip="加载文章中...">
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
                      <span>阅读量: <Tag color="blue">{item.amount}</Tag></span>,
                      <span>分类: <Tag
                        color={item.category.color}>{item.category.name}</Tag></span>,
                      <span>标签: {item.tag.map(tag => {
                        return (
                          <Tag color={tag.color} key={tag.id}>{tag.name}</Tag>)
                      })}</span>
                    ]}
                  >
                    <List.Item.Meta
                      title={<a href={`/article/${item.id}`} target="_blank"
                                rel="noopener noreferrer">{item.title}</a>}
                      avatar=<Avatar src={item.owner.avatar}
                      alt={item.owner.nickname} size={48}/>
                    description={<>
                    <span
                      style={{marginRight: 10}}>作者: {item.owner.nickname}</span><span>发布于: {moment(item.created_time).format("LL")}</span></>}
                    />
                    {item.desc}
                  </List.Item>
                )
              }}
            />
          </Spin>
        </Card>
      </>
    );
  }
}

export default Article;