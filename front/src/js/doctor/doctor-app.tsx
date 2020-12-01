import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import {HashRouter, Route, Switch} from "react-router-dom";
import {observer} from "mobx-react";

import "../../css/doctor/doctor-app.less";
import FavIcon from "../../assets/favicon.png";
import {DoctorLogin} from "./doctor-auth";
import {DoctorSkeleton} from "./doctor-skeleton";

@observer
class DoctorApp extends React.Component<{}, {}> {
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
                        <Route path="/login" component={DoctorLogin}/>
                        <Route component={DoctorSkeleton}/>
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<DoctorApp/>, document.getElementById("root"));
