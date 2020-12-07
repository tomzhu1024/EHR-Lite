import React from "react";
import ReactDOM from "react-dom";
import {Helmet} from "react-helmet";
import {HashRouter, Route} from "react-router-dom";
import {observer} from "mobx-react";

import "../../css/patient/patient-app.less";
import FavIcon from "../../assets/favicon.png";
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
                    <Route component={PatientSkeleton}/>
                </HashRouter>
            </div>
        );
    }
}

ReactDOM.render(<PatientApp/>, document.getElementById("root"));
