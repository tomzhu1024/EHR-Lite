import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Breadcrumb, Card, Carousel, notification, Space, Spin, Steps} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import $ from "jquery";
import Pic1 from "../../assets/pic1.jpg";
import Pic2 from "../../assets/pic2.jpg";
import Pic3 from "../../assets/pic3.jpg";
import Pic4 from "../../assets/pic4.jpg";
import {SERVER_ADDR} from "../misc/const";

const {Step} = Steps;

@observer
class PatientHome extends React.Component<RouteComponentProps, {}> {
    myState: {
        spinning: boolean;
        currentStep: number;
    } & IObservableObject = observable({
        spinning: false,
        currentStep: 0,
    });

    componentDidMount() {
        this.myState.spinning = true;
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/patient/checkStage",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: (data: any) => {
                this.myState.spinning = false;
                if (data.success!) {
                    if (data.stage! === "No Appointment") {
                        this.myState.currentStep = 0;
                    } else if (data.stage! === "Upcoming") {
                        this.myState.currentStep = 1;
                    } else if (data.stage! === "In Queue") {
                        this.myState.currentStep = 2;
                    } else if (data.stage! === "In Progress") {
                        this.myState.currentStep = 3;
                    } else if (data.stage! === "In Dispense") {
                        this.myState.currentStep = 4;
                    }
                } else {
                    notification['error']({
                        message: 'Server Error',
                        description: 'Unable to fetch current stage.'
                    });
                }
            },
            error: () => {
                this.myState.spinning = false;
                notification['error']({
                    message: 'Server Error',
                    description: 'Unable to fetch current stage.'
                });
            }
        });
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Home - EHR Lite</title>
                </Helmet>
                <Breadcrumb>
                    <Breadcrumb.Item href="#/">
                        <HomeOutlined/>
                        <span>Patient Home</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Space direction="vertical" style={{width: "100%", marginTop: "20px"}}>
                    <Carousel autoplay autoplaySpeed={3000} effect="fade">
                        <div>
                            <div style={{
                                height: 'calc(100vh - 375px)',
                                width: '100%',
                            }}>
                                <img
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                    src={Pic4}
                                />
                            </div>
                        </div>
                        <div>
                            <div style={{
                                height: 'calc(100vh - 375px)',
                                width: '100%',
                            }}>
                                <img
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                    src={Pic3}
                                />
                            </div>
                        </div>
                        <div>
                            <div style={{
                                height: 'calc(100vh - 375px)',
                                width: '100%',
                            }}>
                                <img
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                    src={Pic2}
                                />
                            </div>
                        </div>
                        <div>
                            <div style={{
                                height: 'calc(100vh - 375px)',
                                width: '100%',
                            }}>
                                <img
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                    src={Pic1}
                                />
                            </div>
                        </div>
                    </Carousel>
                    <Spin spinning={this.myState.spinning}>
                        <Card>
                            <Steps
                                current={this.myState.currentStep}
                            >
                                <Step
                                    title="Make Appointment"
                                    description="Schedule an appointment with your doctor."
                                    onClick={() => {
                                        if (this.myState.currentStep === 0) {
                                            this.props.history.push("/makeAppointment");
                                        }
                                    }}
                                />
                                <Step
                                    title="Check-in"
                                    description="Register at front-desk in-person."
                                    onClick={() => {
                                        if (this.myState.currentStep === 1) {
                                            // TODO: Link to CURRENT APPOINTMENT page
                                            this.props.history.push("/");
                                        }
                                    }}
                                />
                                <Step
                                    title="Queue Up"
                                    description="Get a coffee and wait for your turn."
                                    onClick={() => {
                                        if (this.myState.currentStep === 2) {
                                            this.props.history.push("/checkQueue");
                                        }
                                    }}
                                />
                                <Step
                                    title="Consultations"
                                    description="See the doctor."
                                    onClick={() => {
                                        if (this.myState.currentStep === 3) {
                                            // TODO: Link to CURRENT APPOINTMENT page
                                            this.props.history.push("/");
                                        }
                                    }}
                                />
                                <Step
                                    title="Drugs Pick-up"
                                    description="Get your drugs."
                                    onClick={() => {
                                        if (this.myState.currentStep === 4) {
                                            // TODO: Link to CURRENT APPOINTMENT page
                                            this.props.history.push("/");
                                        }
                                    }}
                                />
                            </Steps>

                        </Card>
                    </Spin>
                </Space>
            </>
        );
    }
}

export {
    PatientHome
};
