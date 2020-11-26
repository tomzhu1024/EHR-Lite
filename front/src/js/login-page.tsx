import {observer} from "mobx-react";
import React from "react";
import $ from "jquery";
import {SERVER_ADDR} from "./misc/const";
import Style from "../css/login-page.module.less";
import {Alert, Button, Card, Form, Input, Space, Spin} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {RouteComponentProps} from "react-router-dom";

interface LoginFormState {
    id: string,
    password: string,
    hasError: boolean,
    errMsg: string,
    spinning: boolean
}


@observer
class LoginPage extends React.Component<RouteComponentProps, LoginFormState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            id: '',
            password: '',
            hasError: false,
            errMsg: '',
            spinning: false
        };
    }

    componentDidMount = () => {
        console.log('LoginPage componentDidMount()');
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/isLogin",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: data => {
                console.log("Checking login status", data);
                if (data.is_login!) {
                    this.props.history.push("/patient/home");
                }
            }
        });
    };

    onFinish = () => {
        this.setState({
            spinning: true
        });
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/patient/login",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            data: {
                id: this.state.id,
                password: this.state.password
            },
            success: (data: any) => {
                if (!data.success!) {
                    this.setState({
                        id: '',
                        password: '',
                        hasError: true,
                        errMsg: "Login Failed: " + data.error_message!,
                        spinning: false
                    });
                } else {
                    this.setState({
                        spinning: false
                    });
                    this.props.history.push('/patient/home');
                }
            },
            error: () => {
                this.setState({
                    id: '',
                    password: '',
                    hasError: true,
                    errMsg: "Login Failed: Server error",
                    spinning: false
                });
            }
        });
    };

    render = () => (
        <>
            <div className={Style.gradient}/>
            <div className={Style.box}>
                <Spin spinning={this.state.spinning}>
                    <Card>
                        <h1>Log into EHR-Lite</h1>
                        <Form onFinish={this.onFinish}>
                            <Form.Item
                                name="id"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your ID!"
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon"/>}
                                    placeholder="ID"
                                    value={this.state.id}
                                    onChange={event => {
                                        this.setState({id: event.target.value});
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!"
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={event => {
                                        this.setState({password: event.target.value});
                                    }}
                                />
                            </Form.Item>
                            <Form.Item className={Style.rightAligned}>
                                <Space>
                                    <Button>
                                        Register
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Log in
                                    </Button>
                                </Space>
                            </Form.Item>
                            {this.state.hasError ? (
                                <Form.Item>
                                    <Alert
                                        message={this.state.errMsg}
                                        type="error"
                                        showIcon
                                        closable
                                        afterClose={() => {
                                            this.setState({hasError: false});
                                        }}
                                    />
                                </Form.Item>
                            ) : null}
                        </Form>
                    </Card>
                </Spin>
            </div>
        </>
    )
}

export {
    LoginPage
};
