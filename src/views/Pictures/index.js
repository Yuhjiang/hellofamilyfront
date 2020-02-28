// 展示偶像照片的视图
import React, {Component} from 'react';
import {List, Card} from "antd";

import {getPictures, getGroups} from "../../api";

class Pictures extends Component {
  getData = () => {
    // getPictures({"limit": 20, "page": 1}).then(resp => {
    //   console.log(resp);
    // }).catch(err => {
    //   console.log(err);
    // })
    getGroups().then(resp => {
      console.log(resp);
    }).catch(err => {
      console.log(err);
    })
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    const data = [
      // {
      //   title: 'Title 1',
      //   src: "https://wx1.sinaimg.cn/mw690/785f6650gy1gcbzm5e979j20u00u0te1.jpg",
      // },
      // {
      //   title: 'Title 2',
      //   src: "https://wx1.sinaimg.cn/mw690/785f6650gy1gcbzm5e979j20u00u0te1.jpg",
      // },
      // {
      //   title: 'Title 3',
      //   src: "https://wx1.sinaimg.cn/mw690/785f6650gy1gcbzm5e979j20u00u0te1.jpg",
      // },
      // {
      //   title: 'Title 4',
      //   src: "https://wx1.sinaimg.cn/mw690/785f6650gy1gcbzm5e979j20u00u0te1.jpg",
      // },
    ];
    const src = "https://wx1.sinaimg.cn/mw690/785f6650gy1gcbzm5e979j20u00u0te1.jpg";

    const gridStyle = {
      width: '25%',
      textAlign: 'center',
      padding: 5,
      height: "220px",
    };
    return (
      <Card>
        <Card.Grid style={gridStyle}>
          <div style={{display: "block", height: 210, overflow: "hidden",}}>
            <img
              style={{maxWidth: "100%", display: "block"}}
              src="https://wx1.sinaimg.cn/mw690/785f6650gy1gcbzm5e979j20u00u0te1.jpg"
              alt="123"/>
          </div>
        </Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle}>
          Content
        </Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
        <Card.Grid style={gridStyle}>Content</Card.Grid>
      </Card>
    );
  }
}

export default Pictures;