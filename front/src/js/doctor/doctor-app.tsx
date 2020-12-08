import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import {HashRouter, Route} from "react-router-dom";
import {observer} from "mobx-react";

import "../../css/doctor/doctor-app.less";
import FavIcon from "../../assets/favicon.png";
import {DoctorSkeleton} from "./doctor-skeleton";

@observer
class DoctorApp extends React.Component<{}, {}> {
    render() {
        return (
            <div className="app">
                <Helmet>
                    <meta name="viewport" content="width=device-width"/>
                    <link rel="shortcut icon" href={FavIcon}/>
                </Helmet>
                <HashRouter>
                    <Route component={DoctorSkeleton}/>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<DoctorApp/>, document.getElementById("root"));
