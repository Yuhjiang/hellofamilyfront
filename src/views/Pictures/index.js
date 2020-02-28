// 展示偶像照片的视图
import React, {Component} from 'react';
import {Card, message, Pagination, Spin} from "antd";

import {getPictures} from "../../api";

class Pictures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      page: 1,
      limit: 20,
      total: "",
      isLoading: false
    };
  }

  componentDidMount() {
    this.getData(this.state.limit, 1);
  }

  getData = (limit, page) => {
    this.setState({
      isLoading: true,
    });

    getPictures({limit, page}).then(resp => {
      this.setState({
        pictures: resp.images,
        total: resp.count,
        page: resp.current,
      });
    }).catch(err => {
      message.error("获取数据失败");
    }).finally(() => {
      this.setState({
        isLoading: false,
      })
    })
  };

  handleOnPageChange = (pageNumber) => {
    console.log(pageNumber);
    this.getData(this.state.limit, pageNumber);
  };

  render() {
    const gridStyle = {
      width: '25%',
      textAlign: 'center',
      padding: 5,
      margin: "auto",
      height: "220px",
    };
    return (
      <Spin spinning={this.state.isLoading}>
        <Card>
          {this.state.pictures.map((item, idx) => {
            return (
              <Card.Grid style={gridStyle} key={idx}>
                <div style={{display: "block", height: 210, overflow: "hidden"}}
                     dangerouslySetInnerHTML={{
                       __html: `<img src=${item.url} alt=${item.name} 
                     style="max-width:100%;display:block"/>`
                     }}
                >
                </div>
              </Card.Grid>
            )
          })}
        </Card>
        <Pagination showQuickJumper
                    defaultCurrent={1}
                    total={this.state.total}
                    onChange={this.handleOnPageChange}
                    pageSize={this.state.limit}
                    style={{margin: 20, float: "right"}}
        />
      </Spin>
    );
  }
}

export default Pictures;