import React from "react";
import {Helmet} from "react-helmet";
import {RouteComponentProps} from "react-router-dom";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import {Alert, Button, Card, Form, Input, Space, Spin} from "antd";
import {FormInstance} from "antd/lib/form";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import $ from "jquery";
import {SERVER_ADDR} from "../misc/const";
import {hash} from "../misc/util";
import Style from "../../css/doctor/doctor-auth.module.less";

const formState: {
    hasError: boolean;
    hasSuccess: boolean;
    message: string;
    spinning: boolean;
} & IObservableObject = observable({
    hasError: false,
    hasSuccess: false,
    message: '',
    spinning: false
});

@observer
class DoctorLogin extends React.Component<RouteComponentProps, {}> {
    formRef = React.createRef<FormInstance>();

    componentDidMount() {
        formState.hasError = false;
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/isLogin",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: data => {
                if (data.is_login!) {
                    this.props.history.push("/");
                }
            }
        });
    }

    onFinish = (fieldsValue: any) => {
        formState.spinning = true;
        formState.hasError = false;
        formState.hasSuccess = false;
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/doctor/login",
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
                formState.spinning = false;
                if (!data.success!) {
                    formState.hasError = true;
                    formState.message = "Login Failed: " + data.error_message!;
                } else {
                    this.props.history.push('/');
                }
            },
            error: () => {
                formState.spinning = false;
                formState.hasError = true;
                formState.message = "Login Failed: Server error.";
            }
        });
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Doctor Login - EHR Lite</title>
                </Helmet>
                <div className={Style.gradient}/>
                <div className={Style.loginBox}>
                    <Spin spinning={formState.spinning}>
                        <Card>
                            <h1 className={Style.title}>Doctor Login</h1>
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
                                        <Button type="primary" htmlType="submit">
                                            Log in
                                        </Button>
                                    </Space>
                                </Form.Item>
                                {formState.hasSuccess ? (
                                    <Form.Item>
                                        <Alert
                                            message={formState.message}
                                            type="success"
                                            showIcon
                                            closable
                                            afterClose={() => {
                                                formState.hasSuccess = false;
                                            }}
                                        />
                                    </Form.Item>
                                ) : null}
                                {formState.hasError ? (
                                    <Form.Item>
                                        <Alert
                                            message={formState.message}
                                            type="error"
                                            showIcon
                                            closable
                                            afterClose={() => {
                                                formState.hasError = false;
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
    DoctorLogin
};
