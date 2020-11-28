import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import {HashRouter, Route, Switch} from "react-router-dom";
import {observer} from "mobx-react";
import "antd/dist/antd.less";

import {PatientLogin, PatientRegister} from "./patient-auth";
import {PatientSkeleton} from "./patient-skeleton";
import "../css/app.less";
import FavIcon from "../assets/favicon.png";

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
                    <Switch>
                        <Route path="/patient/login" exact component={PatientLogin}/>
                        <Route path="/patient/register" exact component={PatientRegister}/>
                        <Route path="/patient" component={PatientSkeleton}/>
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
