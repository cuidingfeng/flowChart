import React from 'react';
import { Layout, Card, Form, Icon, Input, Button, Checkbox } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

import styles from './index.less';

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className={[styles.right, "login-form-forgot"].join(" ")} href="">
            Forgot password
          </a>
          </Form.Item>
          <Form.Item>

          
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          
          <span className={styles.right}>Or <a href="" >register now!</a></span>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);


const LoginPage = () => {
  return (
    <Layout className={styles.wrap}>
      <Header className={styles.head}>Dsssd Login</Header>
      <Content className={styles.form}>
      <WrappedNormalLoginForm />
      </Content>
      <Footer>
      
      <Card title="Third-party Logins" bordered={false} className={styles.card}>
      <div class="g-signin2" data-onsuccess="onSignIn"></div>
      </Card>
      
      </Footer>
    </Layout>
    
  );
};


export default LoginPage;
