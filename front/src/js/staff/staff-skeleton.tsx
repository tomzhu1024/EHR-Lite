import React from "react";
import {observer} from "mobx-react";
import {IObservableObject, observable} from "mobx";
import {Route, RouteComponentProps} from "react-router-dom";
import {History} from "history";
import {Layout, Menu, notification} from "antd";
import {HomeOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {Scrollbar} from "react-scrollbars-custom";
import $ from "jquery";

import {SERVER_ADDR} from "../misc/const";
import Style from "../../css/staff/staff-skeleton.module.less";
import Logo from "../../assets/EHRLiteLOGO.png";
import {StaffFrontDesk} from "./staff-front-desk";
import {StaffDispenser} from "./staff-dispenser";

const {SubMenu} = Menu;
const {Header, Footer, Content} = Layout;

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
                                url: SERVER_ADDR + "/staff/logout",
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
                                    url: SERVER_ADDR + "/staff/logout",
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
class StaffSkeleton extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <Layout className={Style.fixedLayout}>
                <Header>
                    <Navbar history={this.props.history}/>
                </Header>
                <Layout>
                    <Content>
                        <Scrollbar noScrollX={true}>
                            <Route path="/frontDesk" component={StaffFrontDesk}/>
                            <Route path="/dispenser" component={StaffDispenser}/>
                        </Scrollbar>
                    </Content>
                </Layout>
                <Footer>
                    <div style={{textAlign: "center"}}>Staff-side Client - EHR Lite © 2020</div>
                </Footer>
            </Layout>
        );
    }
}

export {
    StaffSkeleton
};
