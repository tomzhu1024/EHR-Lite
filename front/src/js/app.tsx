import React, {FC} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {BrowserRouter} from "react-router-dom";
import {Helmet} from "react-helmet";
import "../css/app.less";
import {LoginPage} from "./components/login-page";

const App: FC = () => (
    <>
        <Helmet>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width"/>
        </Helmet>
        <LoginPage/>
    </>
);

ReactDOM.render(<App/>, document.getElementById("root"));
