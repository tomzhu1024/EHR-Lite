import {observer} from "mobx-react";
import React from "react";
import $ from "jquery";
import {SERVER_ADDR} from "./misc/const";
import Style from "../css/patient-login-page.module.less";
import {Alert, Button, Card, Form, Input, Space, Spin} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {RouteComponentProps} from "react-router-dom";
import {observable} from "mobx";

interface PatientLoginPageState {
    id: string,
    password: string,
    hasError: boolean,
    errMsg: string,
    spinning: boolean
}

@observer
class PatientLoginPage extends React.Component<RouteComponentProps, {}> {
    myState: PatientLoginPageState = observable({
        id: '',
        password: '',
        hasError: false,
        errMsg: '',
        spinning: false
    });

    componentDidMount() {
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/isLogin",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: data => {
                if (data.is_login!) {
                    this.props.history.push("/patient/home");
                }
            }
        });
    }

    onFinish = () => {
        this.myState.spinning = true;
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/patient/login",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            data: {
                id: this.myState.id,
                password: this.myState.password
            },
            success: (data: any) => {
                this.myState.spinning = false;
                this.myState.id = '';
                this.myState.password = '';
                if (!data.success!) {
                    this.myState.hasError = true;
                    this.myState.errMsg = "Login Failed: " + data.error_message!;
                } else {
                    this.props.history.push('/patient/home');
                }
            },
            error: () => {
                this.myState.spinning = false;
                this.myState.id = '';
                this.myState.password = '';
                this.myState.hasError = true;
                this.myState.errMsg = "Login Failed: Server error";
            }
        });
    }

    render() {
        return (
            <>
                <div className={Style.gradient}/>
                <div className={Style.box}>
                    <Spin spinning={this.myState.spinning}>
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
                                        value={this.myState.id}
                                        onChange={event => {
                                            this.myState.id = event.target.value;
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
                                        value={this.myState.password}
                                        onChange={event => {
                                            this.myState.password = event.target.value;
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
                                {this.myState.hasError ? (
                                    <Form.Item>
                                        <Alert
                                            message={this.myState.errMsg}
                                            type="error"
                                            showIcon
                                            closable
                                            afterClose={() => {
                                                this.myState.hasError = false;
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
}

export {
    PatientLoginPage
};
