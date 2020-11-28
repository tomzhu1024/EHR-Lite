import React from "react";
import {Helmet} from "react-helmet";
import {Link, RouteComponentProps} from "react-router-dom";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import {Alert, Button, Card, DatePicker, Form, Input, Space, Spin} from "antd";
import {FormInstance} from "antd/lib/form";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import $ from "jquery";
import {SERVER_ADDR} from "./misc/const";
import {hash} from "./misc/util";
import Style from "../css/patient-auth.module.less";

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
class PatientLogin extends React.Component<RouteComponentProps, {}> {
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
                formState.message = "Login Failed: Server error";
            }
        });
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Patient Login - EHR Lite</title>
                </Helmet>
                <div className={Style.gradient}/>
                <div className={Style.loginBox}>
                    <Spin spinning={formState.spinning}>
                        <Card>
                            <h1 className={Style.title}>Patient Login</h1>
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
                                            this.props.history.push("/register");
                                        }}>
                                            Register
                                        </Button>
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

@observer
class PatientRegister extends React.Component<RouteComponentProps, {}> {
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
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/patient/register",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            data: {
                id: fieldsValue.id!,
                password: hash(fieldsValue.password!),
                name: fieldsValue.name!,
                birthday: fieldsValue.birthday!.format('YYYY-MM-DD')
            },
            success: (data: any) => {
                this.formRef.current.resetFields();
                formState.spinning = false;
                if (!data.success!) {
                    formState.hasError = true;
                    formState.message = "Register Failed: " + data.error_message!;
                } else {
                    formState.hasSuccess = true;
                    formState.message = "Registered Successfully!";
                    this.props.history.push('/login');
                }
            },
            error: () => {
                formState.spinning = false;
                formState.hasError = true;
                formState.message = "Register Failed: Server error";
            }
        });
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Patient Register - EHR Lite</title>
                </Helmet>
                <div className={Style.gradient}/>
                <div className={Style.registerBox}>
                    <Spin spinning={formState.spinning}>
                        <Card>
                            <h1 className={Style.title}>Patient Registration</h1>
                            <Form
                                onFinish={this.onFinish}
                                ref={this.formRef}
                                layout="vertical"
                            >
                                <Form.Item
                                    name="id"
                                    label="ID"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your ID!',
                                        }
                                    ]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label="Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your nickname!', whitespace: true
                                        }
                                    ]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item
                                    name={"confirm"}
                                    label="Confirm Password"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please confirm your password!',
                                        },
                                        ({getFieldValue}) => ({
                                            validator(rule, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('The two passwords that you entered do not match!');
                                            },
                                        })
                                    ]}
                                >
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item
                                    name="birthday"
                                    label="Birthday"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your birthday!'
                                        }
                                    ]}
                                    className={Style.formItem}
                                >
                                    <DatePicker/>
                                </Form.Item>
                                <Form.Item className={Style.rightAligned}>
                                    <Space>
                                        <Link to="/login">Already have an account?</Link>
                                        <Button type="primary" htmlType="submit">
                                            Register
                                        </Button>
                                    </Space>
                                </Form.Item>
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
    PatientLogin, PatientRegister
};
