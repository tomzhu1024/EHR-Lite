import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import {HashRouter, Route} from "react-router-dom";
import {observer} from "mobx-react";

import "../../css/staff/staff-app.less";
import FavIcon from "../../assets/favicon.png";
import {StaffSkeleton} from "./staff-skeleton";

@observer
class StaffApp extends React.Component<{}, {}> {
    render() {
        return (
            <div className="app">
                <Helmet>
                    <meta name="viewport" content="width=device-width"/>
                    <link rel="shortcut icon" href={FavIcon}/>
                </Helmet>
                <HashRouter>
                    <Route component={StaffSkeleton}/>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<StaffApp/>, document.getElementById("root"));
