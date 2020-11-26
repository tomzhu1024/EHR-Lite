import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";

import "antd/dist/antd.less";
import FavIcon from "../assets/favicon.png";
import {observer} from "mobx-react";
import {HashRouter, Route} from "react-router-dom";
import {PatientLoginPage} from "./patient-login-page";
import {PatientHomePage} from "./patient-home-page";


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
                    <Route path="/patient/home" component={PatientHomePage}/>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
