import {observer} from "mobx-react";
import React from "react";
import {History} from "history";
import {IObservableObject, observable} from "mobx";
import $ from "jquery";
import {Layout, Menu, notification} from "antd";
import {LaptopOutlined, LogoutOutlined, NotificationOutlined, UserOutlined, PlusOutlined, CalendarOutlined} from "@ant-design/icons";
import {Route, RouteComponentProps} from "react-router-dom";
import {Scrollbar} from "react-scrollbars-custom";

import {SERVER_ADDR} from "./misc/const";
import Style from "../css/patient-skeleton.module.less";
import Logo from "../assets/EHRLiteLOGO.png";
import {PatientMakeReservation} from "./patient-make-reservation";
import {PatientCheckReservation} from "./patient-check-reservation";
import {Test} from "./test";

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
                    this.props.history.push("/patient/login");
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
class SideMenu extends React.Component<{ history: History }, {}> {
    render() {
        return (
            <>
                <Menu
                    mode="inline"
                    selectedKeys={[]}
                    style={{borderRight: '5px'}}
                >
                    <SubMenu key="sub1" icon={<CalendarOutlined/>} title="My Reservation">
                        <Menu.Item
                            key="1"
                            icon={<PlusOutlined/>}
                            onClick={() => {
                                this.props.history.push("/patient/makeReservation");
                            }}
                        >
                            Add New
                        </Menu.Item>
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
                                <Route path="/patient/makeReservation" component={PatientMakeReservation}/>
                                <Route path="/patient/checkReservation" component={PatientCheckReservation}/>
                                <Route path="/patient/test" component={Test}/>
                            </div>
                        </Scrollbar>
                    </Content>
                </Layout>
                <Footer>
                    <div style={{textAlign: "center"}}>Patient Side - EHR Lite © 2020</div>
                </Footer>
            </Layout>
        );
    }
}

export {
    PatientSkeleton
};
