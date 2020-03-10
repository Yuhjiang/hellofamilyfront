import React, {Component} from 'react';
import {Button, Card, Table, Tag, message} from "antd";
import moment from "moment";

import {getUserList} from "../../api/user";

const displayTitle = {
  username: "用户名",
  nickname: "昵称",
  email: "邮箱",
  birthday: "生日",
  is_admin: "权限",
};

class AdminUser extends Component {
  constructor(props) {
    super(props);
    const columns = this.createColumns(["username", "nickname", "email", "birthday", "is_admin"])
    this.state = {
      offset: 0,
      limited: 10,
      total: 0,
      dataSource: [],
      columns: columns,
      isLoading: false,
      deleteModalVisible: false,
      confirmLoading: false,
    }
  };

  componentDidMount() {
    this.getData(0, this.state.limited);
  }

  getData = (offset, limited) => {
    this.setState({
      isLoading: true,
    });

    getUserList({offset, limited}).then(resp =>{
      this.setState({
        dataSource: resp.results,
      offset: offset,
      total: resp.count,
      });
    }).catch(err => {
      message.error(err);
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  createColumns = columnKeys => {
    const columns = columnKeys.map(item => {
      if (item === "birthday") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (record.birthday ? moment(record.birthday).format("LL") : "");
          }
        }
      }
      else if (item === "is_admin") {
        return {
          title: displayTitle[item],
          key: item,
          dataIndex: item,
          align: "center",
          render: (text, record) => {
            return (
              record.is_admin
              ?
                <Tag color="red">管理员</Tag>
                :
                <Tag color="green">普通用户</Tag>
            )
          }
        }
      }
      else {
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
          <>
            <Button
              size="small"
              onClick={this.onClickEditButton.bind(this, record)}
            >
              编辑
            </Button>
            <Button size="small" danger
                    onClick={this.onClickDeleteButton.bind(this, record)}
            >
              删除
            </Button>
          </>
        )
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

  onClickEditButton = record => {

  };

  onClickDeleteButton = record => {

  };

  render() {
    return (
      <Card
        title="用户列表"
        bordered={false}
        style={{marginTop: 10}}
      >
        <Table
          rowKey={record => record.id}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          bordered
          pagination={{
            current: this.state.offset / this.state.limited + 1,
            total: this.state.total,
            pageSize: this.state.limited,
            showQuickJumper: true,
            hideOnSinglePage: true,
            onChange: this.onPageChange,
          }}
        >

        </Table>
      </Card>
    );
  }
}

export default AdminUser;