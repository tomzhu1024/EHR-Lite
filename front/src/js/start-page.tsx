import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import {HashRouter, Link, Route, RouteComponentProps} from "react-router-dom";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import {Alert, Button, Card, DatePicker, Divider, Form, Input, Space, Spin, Tabs} from "antd";
import {FormInstance} from "antd/lib/form";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import $ from "jquery";
import {Scrollbar} from "react-scrollbars-custom";
import {SERVER_ADDR} from "./misc/const";
import {hash} from "./misc/util";

import "antd/dist/antd.less";
import "../css/global-shared.less";
import Style from "../css/start-page.module.less";
import FavIcon from "../assets/favicon.png";
import Logo from "../assets/EHRLiteLogoBg.png";
import {History} from "history";

const {TabPane} = Tabs;

const patientFormState: {
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

const doctorFormState: {
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

const staffFormState: {
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
class PatientLogin extends React.Component<{ history: History }, {}> {
    formRef = React.createRef<FormInstance>();

    componentDidMount() {
        patientFormState.hasError = false;
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/isLogin",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: data => {
                if (data.is_login!) {
                    window.location.href = "/patient.html#/"
                }
            }
        });
    }

    onFinish = (fieldsValue: any) => {
        patientFormState.spinning = true;
        patientFormState.hasError = false;
        patientFormState.hasSuccess = false;
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
                patientFormState.spinning = false;
                if (!data.success!) {
                    patientFormState.hasError = true;
                    patientFormState.message = "Login Failed: " + data.error_message!;
                } else {
                    window.location.href = "/patient.html#/"
                }
            },
            error: () => {
                patientFormState.spinning = false;
                patientFormState.hasError = true;
                patientFormState.message = "Login Failed: Server error.";
            }
        });
    }

    render() {
        return (
            <Spin spinning={patientFormState.spinning}>
                <Card bordered={false}>
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
                        {patientFormState.hasSuccess ? (
                            <Form.Item>
                                <Alert
                                    message={patientFormState.message}
                                    type="success"
                                    showIcon
                                    closable
                                    afterClose={() => {
                                        patientFormState.hasSuccess = false;
                                    }}
                                />
                            </Form.Item>
                        ) : null}
                        {patientFormState.hasError ? (
                            <Form.Item>
                                <Alert
                                    message={patientFormState.message}
                                    type="error"
                                    showIcon
                                    closable
                                    afterClose={() => {
                                        patientFormState.hasError = false;
                                    }}
                                />
                            </Form.Item>
                        ) : null}
                        <Form.Item>
                            <Space direction="vertical">
                                <Button type="primary" htmlType="submit">
                                    Log in
                                </Button>
                                <Divider>OR</Divider>
                                <Button onClick={() => {
                                    this.props.history.push("/register");
                                }}>
                                    Register
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        )
    }
}

@observer
class PatientRegister extends React.Component<{ history: History }, {}> {
    formRef = React.createRef<FormInstance>();

    componentDidMount() {
        patientFormState.hasError = false;
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/isLogin",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: data => {
                if (data.is_login!) {
                    window.location.href = "/patient.html#/"
                }
            }
        });
    }

    onFinish = (fieldsValue: any) => {
        patientFormState.spinning = true;
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
                patientFormState.spinning = false;
                if (!data.success!) {
                    patientFormState.hasError = true;
                    patientFormState.message = "Register Failed: " + data.error_message!;
                } else {
                    patientFormState.hasSuccess = true;
                    patientFormState.message = "Registered Successfully!";
                    this.props.history.push('/');
                }
            },
            error: () => {
                patientFormState.spinning = false;
                patientFormState.hasError = true;
                patientFormState.message = "Register Failed: Server error";
            }
        });
    }

    render() {
        return (
            <>
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
                    {patientFormState.hasError ? (
                        <Form.Item>
                            <Alert
                                message={patientFormState.message}
                                type="error"
                                showIcon
                                closable
                                afterClose={() => {
                                    patientFormState.hasError = false;
                                }}
                            />
                        </Form.Item>
                    ) : null}
                    <Form.Item className={Style.rightAligned}>
                        <Space>
                            <Link to="/">Already have an account?</Link>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </>
        );
    }
}

@observer
class DoctorLogin extends React.Component<{ history: History }, {}> {
    formRef = React.createRef<FormInstance>();

    componentDidMount() {
        doctorFormState.hasError = false;
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/isLogin",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: data => {
                if (data.is_login!) {
                    window.location.href = "/doctor.html#/"
                }
            }
        });
    }

    onFinish = (fieldsValue: any) => {
        doctorFormState.spinning = true;
        doctorFormState.hasError = false;
        doctorFormState.hasSuccess = false;
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
                doctorFormState.spinning = false;
                if (!data.success!) {
                    doctorFormState.hasError = true;
                    doctorFormState.message = "Login Failed: " + data.error_message!;
                } else {
                    window.location.href = "/doctor.html#/"
                }
            },
            error: () => {
                doctorFormState.spinning = false;
                doctorFormState.hasError = true;
                doctorFormState.message = "Login Failed: Server error.";
            }
        });
    }

    render() {
        return (
            <Spin spinning={patientFormState.spinning}>
                <Card bordered={false}>
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
                        {doctorFormState.hasSuccess ? (
                            <Form.Item>
                                <Alert
                                    message={doctorFormState.message}
                                    type="success"
                                    showIcon
                                    closable
                                    afterClose={() => {
                                        doctorFormState.hasSuccess = false;
                                    }}
                                />
                            </Form.Item>
                        ) : null}
                        {doctorFormState.hasError ? (
                            <Form.Item>
                                <Alert
                                    message={doctorFormState.message}
                                    type="error"
                                    showIcon
                                    closable
                                    afterClose={() => {
                                        doctorFormState.hasError = false;
                                    }}
                                />
                            </Form.Item>
                        ) : null}
                        <Form.Item>
                            <Space direction="vertical">
                                <Button type="primary" htmlType="submit">
                                    Log in
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        );
    }
}

@observer
class StaffLogin extends React.Component<{ history: History }, {}> {
    formRef = React.createRef<FormInstance>();

    componentDidMount() {
        staffFormState.hasError = false;
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/isLogin",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: data => {
                if (data.is_login!) {
                    if (data.role! === 'front') {
                        window.location.href = "/staff.html#/frontDesk"
                    } else if (data.role! === 'dispenser') {
                        window.location.href = "/staff.html#/Dispenser"
                    }
                }
            }
        });
    }

    onFinish = (fieldsValue: any) => {
        staffFormState.spinning = true;
        staffFormState.hasError = false;
        staffFormState.hasSuccess = false;
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/staff/login",
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
                staffFormState.spinning = false;
                if (!data.success!) {
                    staffFormState.hasError = true;
                    staffFormState.message = "Login Failed: " + data.error_message!;
                } else {
                    if (data.role! === 'front') {
                        window.location.href = "/staff.html#/frontDesk"
                    } else if (data.role! === 'dispenser') {
                        window.location.href = "/staff.html#/Dispenser"
                    }
                }
            },
            error: () => {
                staffFormState.spinning = false;
                staffFormState.hasError = true;
                staffFormState.message = "Login Failed: Server error.";
            }
        });
    }

    render() {
        return (
            <Spin spinning={patientFormState.spinning}>
                <Card bordered={false}>
                    <h1 className={Style.title}>Staff Login</h1>
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
                        {staffFormState.hasSuccess ? (
                            <Form.Item>
                                <Alert
                                    message={staffFormState.message}
                                    type="success"
                                    showIcon
                                    closable
                                    afterClose={() => {
                                        staffFormState.hasSuccess = false;
                                    }}
                                />
                            </Form.Item>
                        ) : null}
                        {staffFormState.hasError ? (
                            <Form.Item>
                                <Alert
                                    message={staffFormState.message}
                                    type="error"
                                    showIcon
                                    closable
                                    afterClose={() => {
                                        staffFormState.hasError = false;
                                    }}
                                />
                            </Form.Item>
                        ) : null}
                        <Form.Item>
                            <Space direction="vertical">
                                <Button type="primary" htmlType="submit">
                                    Log in
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        );
    }
}

@observer
class LoginPanel extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <div className={Style.loginCard}>
                <Tabs type="card">
                    <TabPane tab="Patient" key="patient">
                        <PatientLogin history={this.props.history}/>
                    </TabPane>
                    <TabPane tab="Doctor" key="doctor">
                        <DoctorLogin history={this.props.history}/>
                    </TabPane>
                    <TabPane tab="Staff" key="staff">
                        <StaffLogin history={this.props.history}/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

@observer
class RegisterPanel extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <div className={Style.registerCard}>
                <Card bordered={false}>
                    <PatientRegister history={this.props.history}/>
                </Card>
            </div>
        );
    }
}

@observer
class StartPage extends React.Component<{}, {}> {
    render() {
        return (
            <>
                <Helmet>
                    <meta charSet="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <link rel="shortcut icon" href={FavIcon}/>
                    <title>EHR-Lite</title>
                </Helmet>
                <HashRouter>
                    <Scrollbar noScrollX={true} style={{minHeight: "100vh"}}>
                        <div className={Style.logoBox}>
                            <img src={Logo} alt="" onDragStart={(event) => {
                                event.preventDefault();
                            }}/>
                        </div>
                        <Route path="/" exact component={LoginPanel}/>
                        <Route path="/register" component={RegisterPanel}/>
                    </Scrollbar>
                </HashRouter>
            </>
        );
    }
}

ReactDOM.render(<StartPage/>, document.getElementById("root"));
