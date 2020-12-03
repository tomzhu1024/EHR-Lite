import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import {HashRouter, Route, Switch} from "react-router-dom";
import {observer} from "mobx-react";

import "../../css/staff/staff-app.less";
import FavIcon from "../../assets/favicon.png";
import {StaffLogin} from "./staff-auth";
import {StaffSkeleton} from "./staff-skeleton";

@observer
class StaffApp extends React.Component<{}, {}> {
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
                        <Route path="/login" component={StaffLogin}/>
                        <Route component={StaffSkeleton}/>
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<StaffApp/>, document.getElementById("root"));
