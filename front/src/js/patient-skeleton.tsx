import React from "react";
import {observer} from "mobx-react";
import {IObservableObject, observable} from "mobx";
import {Route, RouteComponentProps} from "react-router-dom";
import {History} from "history";
import {Layout, Menu, notification} from "antd";
import {HistoryOutlined, HomeOutlined, LogoutOutlined, ScheduleOutlined, UserOutlined} from "@ant-design/icons";
import {Scrollbar} from "react-scrollbars-custom";
import $ from "jquery";

import {SERVER_ADDR} from "./misc/const";
import Style from "../css/patient-skeleton.module.less";
import Logo from "../assets/EHRLiteLOGO.png";
import {PatientMakeReservation} from "./patient-make-reservation";
import {PatientCheckQueue} from "./patient-check-queue";
import {PatientCheckHistory} from "./patient-check-history";
import {PatientHome} from "./patient-home";

const {SubMenu} = Menu;
const {Header, Footer, Sider, Content} = Layout;

@observer
class Navbar extends React.Component<{ history: History }, {}> {
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
                    this.myState.displayName = data.name!;
                } else {
                    this.props.history.push("/login");
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
                                url: SERVER_ADDR + "/patient/logout",
                                crossDomain: true,
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: () => {
                                    this.props.history.push("/login");
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
                    defaultOpenKeys={["2", "3"]}
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
                    <SubMenu key="2" icon={<ScheduleOutlined/>} title="My Reservation">
                        <Menu.Item
                            key="2sub1"
                            onClick={() => {
                                this.props.history.push("/makeReservation");
                            }}
                        >
                            New Reservation
                        </Menu.Item>
                        <Menu.Item
                            key="2sub2"
                            onClick={() => {
                                this.props.history.push("/checkQueue");
                            }}
                        >
                            Queue Status
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="3" icon={<HistoryOutlined/>} title="My History">
                        <Menu.Item
                            key="3sub1"
                            onClick={() => {
                                this.props.history.push("/checkHistory");
                            }}
                        >
                            All Records
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="4" icon={<UserOutlined/>} title="My Account">
                        <Menu.Item
                            key="4sub1"
                            disabled
                        >
                            Change Password
                        </Menu.Item>
                        <Menu.Item
                            key="4sub2"
                            onClick={() => {
                                $.ajax({
                                    type: "GET",
                                    url: SERVER_ADDR + "/patient/logout",
                                    crossDomain: true,
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    success: () => {
                                        this.props.history.push("/login");
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
class PatientSkeleton extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <Layout className={Style.fixedLayout}>
                <Header>
                    <Navbar history={this.props.history}/>
                </Header>
                <Layout>
                    <Sider collapsedWidth={0} breakpoint={"lg"}>
                        <Scrollbar noScrollX={true}>
                            <SideMenu history={this.props.history}/>
                        </Scrollbar>
                    </Sider>
                    <Content>
                        <Scrollbar noScrollX={true}>
                            <div style={{padding: "25px"}}>
                                <Route path="/" exact component={PatientHome}/>
                                <Route path="/makeReservation" component={PatientMakeReservation}/>
                                <Route path="/checkQueue" component={PatientCheckQueue}/>
                                <Route path="/checkHistory" component={PatientCheckHistory}/>
                            </div>
                        </Scrollbar>
                    </Content>
                </Layout>
                <Footer>
                    <div style={{textAlign: "center"}}>Patient-side Client - EHR Lite © 2020</div>
                </Footer>
            </Layout>
        );
    }
}

export {
    PatientSkeleton
};
