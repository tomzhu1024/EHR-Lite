import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import "antd/dist/antd.less";
import FavIcon from "../assets/favicon.png";
import {observer} from "mobx-react";
import {HashRouter, Link, Route, RouteComponentProps} from "react-router-dom";
import {observable} from "mobx";
import {FormInstance} from "antd/lib/form";
import $ from "jquery";
import {SERVER_ADDR} from "./misc/const";
import {hash} from "./misc/util";
import Style from "../css/app.module.less";
import {Alert, Breadcrumb, Button, Card, DatePicker, Form, Input, Layout, Menu, Space, Spin} from "antd";
import {LaptopOutlined, LockOutlined, LogoutOutlined, NotificationOutlined, UserOutlined, HomeOutlined} from "@ant-design/icons";
import {History} from "history";
import Logo from "../assets/EHRLiteLOGO.png";
import {Scrollbar} from "react-scrollbars-custom";

const {SubMenu} = Menu;
const {Header, Footer, Sider, Content} = Layout;

interface FormState {
    hasError: boolean,
    hasSuccess: boolean,
    message: string,
    spinning: boolean
}

const formState: FormState = observable({
    hasError: false,
    hasSuccess: false,
    message: '',
    spinning: false
});

@observer
class PatientLoginPage extends React.Component<RouteComponentProps, {}> {
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
                    this.props.history.push("/patient/home");
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
                    this.props.history.push('/patient/home');
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
                <div className={Style.gradient}/>
                <div className={Style.loginBox}>
                    <Spin spinning={formState.spinning}>
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
class PatientRegisterPage extends React.Component<RouteComponentProps, {}> {
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
                    this.props.history.push("/patient/home");
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
                    this.props.history.push('/patient/login');
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
                <div className={Style.gradient}/>
                <div className={Style.registerBox}>
                    <Spin spinning={formState.spinning}>
                        <Card>
                            <h1>Patient Registration</h1>
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
                                >
                                    <DatePicker/>
                                </Form.Item>
                                <Form.Item className={Style.rightAligned}>
                                    <Space>
                                        <Link to="/patient/login">Already have an account?</Link>
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

interface NavbarState {
    displayName: string
}

@observer
class Navbar extends React.Component<{ history: History }, {}> {
    myState: NavbarState = observable({
        displayName: ""
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
                    this.myState.displayName = data.name!;
                } else {
                    this.props.history.push("/patient/login");
                }
            }
        });
    }

    render() {
        return (
            <div className={Style.navBar}>
                <div>
                    <img src={Logo} alt=""/>
                </div>
                <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
                    <SubMenu icon={<UserOutlined/>} title={this.myState.displayName}>
                        <Menu.Item onClick={() => {
                            $.ajax({
                                type: "GET",
                                url: SERVER_ADDR + "/patient/logout",
                                crossDomain: true,
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: () => {
                                    this.props.history.push("/patient/login");
                                }
                            });
                        }}>
                            <LogoutOutlined/>
                            Log out
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        );
    }
}

@observer
class SideMenu extends React.Component<{}, {}> {
    render() {
        return (
            <>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{height: '100%', borderRight: 0}}
                >
                    <SubMenu key="sub1" icon={<UserOutlined/>} title="subnav 1">
                        <Menu.Item key="1">option1</Menu.Item>
                        <Menu.Item key="2">option2</Menu.Item>
                        <Menu.Item key="3">option3</Menu.Item>
                        <Menu.Item key="4">option4</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<LaptopOutlined/>} title="subnav 2">
                        <Menu.Item key="5">option5</Menu.Item>
                        <Menu.Item key="6">option6</Menu.Item>
                        <Menu.Item key="7">option7</Menu.Item>
                        <Menu.Item key="8">option8</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<NotificationOutlined/>} title="subnav 3">
                        <Menu.Item key="9">option9</Menu.Item>
                        <Menu.Item key="10">option10</Menu.Item>
                        <Menu.Item key="11">option11</Menu.Item>
                        <Menu.Item key="12">option12</Menu.Item>
                    </SubMenu>
                </Menu>
            </>
        );
    }
}

@observer
class PatientMakeAppointment extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <>
                <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <HomeOutlined/>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <UserOutlined/>
                        <span>Application List</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Application</Breadcrumb.Item>
                </Breadcrumb>

            </>
        );
    }
}

@observer
class PatientHomePage extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <Layout className={Style.fixedLayout}>
                <Header>
                    <Navbar history={this.props.history}/>
                </Header>
                <Layout>
                    <Sider collapsedWidth={0} breakpoint={"lg"}>
                        <Scrollbar noScrollX={true}>
                            <SideMenu/>
                        </Scrollbar>
                    </Sider>
                    <Content>
                        <Route path="/patient/home/makeAppointment" component={PatientMakeAppointment}/>
                    </Content>
                </Layout>
                <Footer>
                    <div className={Style.centered}>Patient Application - EHR Lite © 2020</div>
                </Footer>
            </Layout>
        );
    }
}

@observer
class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="app">
                <Helmet>
                    <meta charSet="UTF-8"/>
                    <meta name="viewport" content="width=device-width"/>
                    <link rel="shortcut icon" href={FavIcon}/>
                </Helmet>
                <HashRouter>
                    <Route path="/patient/login" component={PatientLoginPage}/>
                    <Route path="/patient/register" component={PatientRegisterPage}/>
                    <Route path="/patient/home" component={PatientHomePage}/>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
