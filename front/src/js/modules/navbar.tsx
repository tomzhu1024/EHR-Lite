import React from "react";
import {Menu} from "antd";
import {UserOutlined} from '@ant-design/icons';
import Logo from "../../assets/EHRLiteLOGO.png";
import {AppState} from "../app";
import {observer} from "mobx-react";

@observer
class Navbar extends React.Component<{ appState: AppState }, any> {
    render = () => (
        <div className="navbar">
            <div>
                <img src={Logo}/>
            </div>
            <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
                <Menu.Item>
                    <UserOutlined/>
                    {
                        this.props.appState.hasLogin ?
                            this.props.appState.displayName :
                            "Not Logged In"
                    }
                </Menu.Item>
            </Menu>
        </div>
    );
}

export {
    Navbar
}
