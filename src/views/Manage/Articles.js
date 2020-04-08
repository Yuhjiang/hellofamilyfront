import React, {Component} from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Tag,
  Typography,
  message,
  DatePicker,
} from "antd";
import moment from "moment";

import {getArticleList, deleteArticle} from "../../api/articles";
import {SearchOutlined} from "@ant-design/icons";
import {getColumnSearchProps, getColumnDateSearchProps} from "../../utils";

const {Paragraph} = Typography;
const {RangePicker} = DatePicker;

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
      },
      searchText: "",
      searchedColumn: "",
      startDate: "",
      endDate: "",
    }
  }
  searchInput = React.createRef();
  dateSearch = React.createRef();

  componentDidMount() {
    this.getData();
  }

  assembleParams = () => {
    const params = {
      limited: this.state.limited,
      offset: this.state.offset,
    };
    const {searchText, searchedColumn, startDate, endDate} = this.state;
    if (searchText && searchedColumn) {
      params[searchedColumn] = searchText;
    }
    if (startDate && endDate) {
      params['start_date'] = startDate;
      params['end_date'] = endDate;
    }

    return params;
  };

  getData = () => {
    this.setState({
      isLoading: true,
    });

    const params = this.assembleParams();

    getArticleList(params).then(resp => {
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
      this.getData();
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        confirmLoading: false,
        deleteModalVisible: false,
      })
    })
  };

  handleSearch = (selectKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectKeys[0],
      searchedColumn: dataIndex,
    })
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({
      searchText: "",
    })
  };

  handleDateSearch = (selectKeys, confirm, dataIndex) => {
    confirm();
    if (selectKeys.length === 2) {
      this.setState({
        startDate: selectKeys[0] + " 23:59:59",
        endDate: selectKeys[1] + " 23:59:59",
      })
    } else {
      this.setState({
        startDate: "",
        endDate: "",
      })
    }
  };

  handleDateReset = clearFilters => {
    clearFilters();
    this.setState({
      startDate: "",
      endDate: "",
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
              <Tag
                color={record.amount >= 10 ? "red" : "green"}>{record.amount}</Tag>
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
          },
          ...getColumnDateSearchProps(displayTitle, item, this.handleDateSearch, this.handleDateReset),
        }
      } else if (item === "desc") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return <Paragraph
              ellipsis={{rows: 1, expandable: true}}>{record.desc}</Paragraph>;
          }
        }
      } else if (item === "title") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (<a href={`/article/${record.id}`}
                       style={{color: "#000"}}>{record.title}</a>)
          },
          ...getColumnSearchProps(displayTitle, item, this.searchInput, this.handleSearch, this.handleReset),
        }
      } else if (item === "owner") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: text => {
            return (text.nickname)
          },
          ...getColumnSearchProps(displayTitle, item, this.searchInput, this.handleSearch, this.handleReset),
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
      align: "center",
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
      this.getData();
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
            pageSize: this.state.limited,
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