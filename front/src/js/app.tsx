import React from "react";
import ReactDOM from "react-dom";
import DiagnosisPage from './components/doctor-diagnosis/diagnosis-page'
import CheckPrescription from './components/check-prescription/check-prescription'
import {HashRouter, Route} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Layout, Menu, Breadcrumb} from 'antd';
import {UserOutlined, LaptopOutlined, NotificationOutlined} from '@ant-design/icons';
import "../css/app.less";
import {Navbar} from "./modules/navbar";
import {LoginPage} from "./modules/login-page";
import FavIcon from "../assets/favicon.png";
import {observable} from "mobx";
import PatientSearchBar from "./components/patient-search-bar";
import CheckQueue from "./components/patient-check-queue";

const {SubMenu} = Menu;
const {Header, Sider, Content, Footer} = Layout;

interface AppState {
    hasLogin: boolean
    displayName: string
}

const appState: AppState = observable({
    hasLogin: true,
    displayName: "test"
});

const patientInfo=[
    {
        key: '1',
        date: "2018-10-12",
        department: "Oncology"
    }
]

class App extends React.Component<{ appState: AppState }, null> {
    render = () => (
        <div className="app">
            <CheckPrescription prescriptions={"Cheemo therapy"}/>
            {/* <DiagnosisPage /> */}
            {/* <Helmet>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width"/>
                <link rel="shortcut icon" href={FavIcon}/>
            </Helmet>
            <HashRouter>
                <Layout>
                    <Header className="header">
                        <Navbar appState={this.props.appState}/>
                    </Header>
                    <Layout className="content">
                        {
                            this.props.appState.hasLogin ? (
                                <>
                                    <Sider width={200}>
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
                                    </Sider>
                                    <Layout style={{padding: '0 24px 24px'}}>
                                        <Breadcrumb style={{margin: '16px 0'}}>
                                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                                            <Breadcrumb.Item>List</Breadcrumb.Item>
                                            <Breadcrumb.Item>App</Breadcrumb.Item>
                                        </Breadcrumb>
                                        <Content>
                                            <Route path='/' exact component={LoginPage}/>
                                        </Content>
                                    </Layout>
                                </>
                            ) : (
                                <>
                                    <Layout>
                                        <Content>
                                            <LoginPage/>
                                        </Content>
                                    </Layout>
                                </>
                            )
                        }
                    </Layout>
                    <Footer className="footer">
                        EHR Lite © 2020
                    </Footer>
                </Layout>
            </HashRouter> */}
        </div>
    );
}

ReactDOM.render(<App appState={appState}/>, document.getElementById("root"));

export {
    AppState
};
