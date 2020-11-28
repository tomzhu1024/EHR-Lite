import React from "react";
import {Helmet} from "react-helmet";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Breadcrumb, Button} from "antd";

import Style from "../css/patient-app-shared.module.less";
import {CalendarOutlined, HomeOutlined, PlusOutlined} from "@ant-design/icons";

class PatientCheckReservation extends React.Component<{}, {}> {
    render() {
        return (
            <>
                <Helmet>
                    <title>Check Reservation</title>
                </Helmet>
                <Breadcrumb className={Style.breadcrumb}>
                    <Breadcrumb.Item>
                        <HomeOutlined/>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <CalendarOutlined/>
                        <span>My Reservation</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <PlusOutlined/>
                        <span>Check Current</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </>
        );
    }
}

export {
    PatientCheckReservation
};
