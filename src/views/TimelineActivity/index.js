import React, {Component} from 'react';
import {Card, Button, Select, Row, Col, message, List, Tag, Spin, Cascader} from "antd";

import {getNewsTypeList, getHelloNewsList} from "../../api/news";
import {getGroups, getMembers} from "../../api/pictures";
import moment from "moment";

const {Option} = Select;


const categoryLayout = {
  xs: 24,
  sm: 12,
  md: 6,
  lg: 6,
};

const memberLayout = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
};


class TimelineActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsOrTimeline: true,
      category: "",
      group: "",
      member: "",
      categoryList: [],
      groupList: [],
      memberList: [],
      categoryLoading: false,
      isLoading: false,
      dataSource: [],
      total: 0,
      offset: 0,
      limited: 10,
    };
  }

  componentDidMount() {
    this.getData();
    this.getNewsType();
    this.getGroupsList()
  }

  assembleParams = () => {
    const params = {
      offset: this.state.offset,
      limited: this.state.limited,
    };
    const {category, group, member} = this.state;
    if (category) {
      params.category = category;
    }
    if (group) {
      params.group = group;
    }
    if (member) {
      params.member = member;
    }
    return params;
  };

  getData = () => {
    this.setState({
      isLoading: true
    });
    const params = this.assembleParams();
    getHelloNewsList(params).then(resp => {
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


  getNewsType = () => {
    this.setState({
      categoryLoading: true,
    });
    getNewsTypeList({limited: 100}).then(resp => {
      this.setState({
        categoryList: resp.results,
      })
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        categoryLoading: false,
      })
    })
  };

  getGroupsList = () => {
    this.setState({
      groupLoading: true,
    });
    getGroups({limited: 100}).then(resp => {
      this.setState({
        groupList: resp.results,
        memberList: resp.results.map(item => {
          return {
            label: item.name_jp,
            value: item.id,
            isLeaf: false,
          }
        }),
      })
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        groupLoading: false,
      })
    })
  };

  loadMember = groupOptions => {
    const targetGroup = groupOptions[groupOptions.length - 1];
    targetGroup.loading = true;

    getMembers({"group_id": targetGroup.value, "limited": 100}).then(resp => {
      targetGroup.loading = false;
      targetGroup.children = resp.results.map(item => {
        return {
          label: item.name_jp,
          value: item.id,
        }
      });
      this.setState({
        memberList: [...this.state.memberList],
      })
    }).catch(err => {
      message.error(err);
    })
  };

  handleViewChange = () => {
    this.setState(state => {
      return {
        newsOrTimeline: !state.newsOrTimeline,
      }
    })
  };

  handleOnCategorySelect = category => {
    this.setState({
      category: category,
    }, () => {
      this.getData();
    })
  };

  handleOnCategoryChange = category => {
    if (category === undefined) {
      this.setState({
        category: category,
      }, () => {
        this.getData();
      })
    }
  };

  handleOnGroupSelect = group => {
    this.setState({
      group: group,
    }, () => {
      this.getData();
    })
  };

  handleOnGroupChange = group => {
    if (group === undefined) {
      this.setState({
        group: undefined,
      }, () => {
        this.getData();
      })
    }
  };

  handleOnMemberSelect = (value, selectedOptions) => {
    if (selectedOptions.length >= 2) {
        this.setState({
          member: value[1]
        }, () => {
          this.getData();
        })
    } else if (selectedOptions.length === 0) {
      this.setState({
        member: undefined,
      }, () => {
        this.getData();
      })
    }
  };


  render() {
    return (
      <>
        <Card
          title="资讯列表"
          bordered={false}
          extra={
            <Button
              onClick={this.handleViewChange}>
              {this.state.newsOrTimeline ? "切换成时间线" : "切换成默认"}
            </Button>
          }
        >
          <Row>
            <Col {...categoryLayout}>
              <Select
                placeholder="选择分类"
                allowClear={true}
                style={{width: "80%"}}
                onSelect={this.handleOnCategorySelect}
                onChange={this.handleOnCategoryChange}
              >
                {this.state.categoryList.map(item => (
                  <Option value={item.id} key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Col>
            <Col {...categoryLayout}>
              <Select
                placeholder="组合"
                allowClear={true}
                style={{width: "80%"}}
                onSelect={this.handleOnGroupSelect}
                onChange={this.handleOnGroupChange}
              >
                {this.state.groupList.map(item => (
                  <Option value={item.id} key={item.id}>{item.name_jp}</Option>
                ))}
              </Select>
            </Col>
            <Col {...memberLayout}>
              <Cascader
                options={this.state.memberList}
                loadData={this.loadMember}
                onChange={this.handleOnMemberSelect}
                changeOnSelect
                style={{width: "100%"}}
              />
            </Col>
          </Row>
        </Card>
        <Card
          bordered={false}
          style={{marginTop: 10}}>
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
                      <span>组合: {item.group.map(g => {
                        return (<Tag color={g.color} key={g.id}>{g.name_jp}</Tag>)
                      })}</span>,
                      <span>成员: {item.member.map(m => {
                        return (<Tag color={m.color} key={m.id}>{m.name_jp}</Tag>)
                      })}</span>
                    ]}
                  >
                    <List.Item.Meta
                      title={<span>
                        <Tag color={item.category.color}>{item.category.name}</Tag>
                        <a href={`/activity/${item.id}`} style={{color: "#000"}}>{item.title}</a>
                      </span>}
                      description={<>
                        <span>发布于: {moment(item.created_date).format("LL")}</span></>}
                    />
                    {item.desc}
                  </List.Item>
                )
              }}
            />
          </Spin>
        </Card>
      </>
    )
  }
}

export default TimelineActivity;