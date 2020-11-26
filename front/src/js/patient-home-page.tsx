import React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router-dom";
import Style from "../css/patient-home.module.less";
import Logo from "../assets/EHRLiteLOGO.png";
import {Breadcrumb, Layout, Menu} from "antd";
import {LaptopOutlined, LogoutOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import {SERVER_ADDR} from "./misc/const";
import $ from "jquery";
import {observable} from "mobx";
import {History} from "history";
import {Scrollbar} from "react-scrollbars-custom";

const {SubMenu} = Menu;
const {Header, Footer, Sider, Content} = Layout;

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
                        <Breadcrumb/>
                        {/* TODO: primary components */}
                    </Content>
                </Layout>
                <Footer>
                    <div className={Style.centered}>EHR Lite © 2020</div>
                </Footer>
            </Layout>
        );
    }
}

export {
    PatientHomePage
};
