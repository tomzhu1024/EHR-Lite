import {observer} from "mobx-react";
import React from "react";
import $ from "jquery";
import {SERVER_ADDR} from "./misc/const";
import Style from "../css/patient-form.module.less";
import {Alert, Button, Card, Form, Input, Space, Spin} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {RouteComponentProps} from "react-router-dom";
import {observable} from "mobx";
import {FormInstance} from 'antd/lib/form';
import {hash} from "./misc/util";

interface PatientLoginPageState {
    hasError: boolean,
    errMsg: string,
    spinning: boolean
}

@observer
class PatientLoginPage extends React.Component<RouteComponentProps, {}> {
    formRef = React.createRef<FormInstance>();
    myState: PatientLoginPageState = observable({
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

    onFinish = (fieldsValue: any) => {
        console.log(fieldsValue.id!);
        console.log(hash(fieldsValue.password!));
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
                id: fieldsValue.id!,
                password: hash(fieldsValue.password!)
            },
            success: (data: any) => {
                this.formRef.current.resetFields();
                this.myState.spinning = false;
                if (!data.success!) {
                    this.myState.hasError = true;
                    this.myState.errMsg = "Login Failed: " + data.error_message!;
                } else {
                    this.props.history.push('/patient/home');
                }
            },
            error: () => {
                this.myState.spinning = false;
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
                            <h1>Patient Login</h1>
                            <Form
                                onFinish={this.onFinish}
                                ref={this.formRef}
                                layout="vertical"
                            >
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
                                    />
                                </Form.Item>
                                <Form.Item className={Style.rightAligned}>
                                    <Space>
                                        <Button onClick={() => {
                                            this.props.history.push("/patient/register");
                                        }}>
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
