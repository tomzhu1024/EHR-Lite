import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import {HashRouter, Route, Switch} from "react-router-dom";
import {observer} from "mobx-react";

import "../../css/patient/patient-app.less";
import FavIcon from "../../assets/favicon.png";
import {PatientLogin, PatientRegister} from "./patient-auth";
import {PatientSkeleton} from "./patient-skeleton";

@observer
class PatientApp extends React.Component<{}, {}> {
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
                        <Route path="/login" component={PatientLogin}/>
                        <Route path="/register" component={PatientRegister}/>
                        <Route component={PatientSkeleton}/>
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<PatientApp/>, document.getElementById("root"));
