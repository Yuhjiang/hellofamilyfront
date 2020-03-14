import React, {Component} from 'react';
import {Button, Card, Form, Input, Row, Col, Table, Modal, message} from "antd";
import {ChromePicker} from "react-color";

class AdminGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,

    }
  }

  formRef = React.createRef();

  onFinish = values => {

  };

  onFinishFailed = errors => {

  };

  render() {
    return (
      <>
        <Card
          title="添加组合"
          style={{marginTop: 10}}
        >
          <Form
            name="addGroup"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            ref={this.formRef}
          >

          </Form>
        </Card>
        </>
    );
  }
}

export default AdminGroups;