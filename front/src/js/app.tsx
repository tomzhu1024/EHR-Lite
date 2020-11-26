import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import {Layout, Menu} from 'antd';
import {LoginOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {observable} from "mobx";
import $ from "jquery";

import "antd/dist/antd.less";
import Style from "../css/app.module.less";
import FavIcon from "../assets/favicon.png";
import Logo from "../assets/EHRLiteLOGO.png"
import {SERVER_ADDR} from "./misc/const";
import {observer} from "mobx-react";
import {HashRouter, Route} from "react-router-dom";
import {LoginPage} from "./login-page";
import {HomePage} from "./home-page";

const {SubMenu} = Menu;

const {Header, Footer, Sider, Content} = Layout;

interface LoginState {
    isLogin: boolean,
    displayName: string
}

const loginState: LoginState = observable({
    isLogin: false,
    displayName: ''
});

@observer
class Navbar extends React.Component<{}, {}> {
    render = () => (
        <div className={Style.navBar}>
            <div>
                <img src={Logo} alt=""/>
            </div>
            <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
                {loginState.isLogin ? (
                    <SubMenu icon={<UserOutlined/>} title={loginState.displayName}>
                        <Menu.Item>
                            <LogoutOutlined/>
                            Log out
                        </Menu.Item>
                    </SubMenu>
                ) : (
                    <Menu.Item>
                        <LoginOutlined/>
                        Login
                    </Menu.Item>
                )}
            </Menu>
        </div>
    );
}



@observer
class App extends React.Component<{}, {}> {
    render = () => (
        <div className="app">
            <Helmet>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width"/>
                <link rel="shortcut icon" href={FavIcon}/>
            </Helmet>
            <HashRouter>
                <Route path="/patient/login" component={LoginPage}/>
                <Route path="/patient/home" component={HomePage}/>
            </HashRouter>
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById("root"));

export {
    loginState
}
