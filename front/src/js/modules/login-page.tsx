import React from "react";
import {Button, Checkbox, Form, Input, Tabs, Divider, Space} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
const { TabPane } = Tabs;

class PatientLoginForm extends React.Component<any, any> {
    onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    render = () => (
        <Form onFinish={this.onFinish}>
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    }
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    }
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item className="text-and-button">
                <a onClick={() => console.log('forget password')}>
                    Forgot password?
                </a>
                <Space>
                    <Button>
                        Register
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Log in
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
}

class LoginPage extends React.Component<any, any> {
    render = () => (
        <div className='login-page'>
            <div className='box'>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="Patient" key="1">
                        <PatientLoginForm/>
                    </TabPane>
                    <TabPane tab="Doctor" key="2">
                        Content of card tab 2
                    </TabPane>
                    <TabPane tab="Staff" key="3">
                        Content of card tab 3
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export {
    LoginPage
};