import React from "react";
import {observer} from "mobx-react";
import {IObservableObject, observable} from "mobx";
import {Route, RouteComponentProps} from "react-router-dom";
import {History} from "history";
import {Layout, Menu, notification} from "antd";
import {HomeOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import $ from "jquery";

import {SERVER_ADDR} from "../misc/const";
import Style from "../../css/doctor/doctor-skeleton.module.less";
import Logo from "../../assets/EHRLiteLOGO.png";
import {DoctorHome} from "./doctor-home";

const {SubMenu} = Menu;
const {Header, Footer, Sider, Content} = Layout;

@observer
class Navbar extends React.Component<{}, {}> {
    myState: { displayName: string } & IObservableObject = observable({
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
                    if (data.type! === 'patient') {
                        window.location.href = '/patient.html';
                    } else if (data.type! === 'doctor') {
                        this.myState.displayName = data.name!;
                    } else if (data.type! === 'front') {
                        window.location.href = '/staff.html#/frontDesk';
                    } else if (data.type! === 'dispenser') {
                        window.location.href = '/patient.html#/dispenser';
                    }
                } else {
                    window.location.href = "/";
                }
            },
            error: () => {
                notification["error"]({
                    message: "Server Error",
                    description: "Unable to fetch username."
                });
            }
        });
    }

    render() {
        return (
            <div className={Style.navBar}>
                <div>
                    <img src={Logo} alt="" onDragStart={(event) => {
                        event.preventDefault();
                    }}/>
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[]}
                >
                    <SubMenu icon={<UserOutlined/>} title={this.myState.displayName}>
                        <Menu.Item onClick={() => {
                            $.ajax({
                                type: "GET",
                                url: SERVER_ADDR + "/doctor/logout",
                                crossDomain: true,
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: () => {
                                    window.location.href = "/";
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
class SideMenu extends React.Component<{ history: History }, {}> {
    render() {
        return (
            <>
                <Menu
                    mode="inline"
                    selectedKeys={[]}
                    defaultOpenKeys={[]}
                    style={{borderRight: '5px'}}
                >
                    <Menu.Item
                        key="1"
                        icon={<HomeOutlined/>}
                        onClick={() => {
                            this.props.history.push("/");
                        }}
                    >
                        Home
                    </Menu.Item>
                    <SubMenu key="2" icon={<UserOutlined/>} title="My Account">
                        <Menu.Item
                            key="2sub1"
                            disabled
                        >
                            Change Password
                        </Menu.Item>
                        <Menu.Item
                            key="2sub2"
                            onClick={() => {
                                $.ajax({
                                    type: "GET",
                                    url: SERVER_ADDR + "/doctor/logout",
                                    crossDomain: true,
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    success: () => {
                                        window.location.href = "/";
                                    }
                                });
                            }}
                        >
                            Logout
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </>
        );
    }
}

@observer
class DoctorSkeleton extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <Layout className={Style.fixedLayout}>
                <Header>
                    <Navbar/>
                </Header>
                <Layout>
                    <Content>
                        <Route path="/" exact component={DoctorHome}/>
                    </Content>
                </Layout>
                <Footer>
                    <div style={{textAlign: "center"}}>Doctor-side Client - EHR Lite (C) 2020</div>
                </Footer>
            </Layout>
        );
    }
}

export {
    DoctorSkeleton
};
