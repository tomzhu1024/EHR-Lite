import React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router-dom";

@observer
class HomePage extends React.Component<RouteComponentProps, {}> {
    render = () => (
        <h1>Home page for patient</h1>
    );
}

export {
    HomePage
};
