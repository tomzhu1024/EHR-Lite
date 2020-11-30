import React, {CSSProperties} from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Breadcrumb, Card, Carousel, notification, Space, Spin, Steps} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import $ from "jquery";
import {SERVER_ADDR} from "./misc/const";

const {Step} = Steps;

const contentStyle: CSSProperties = {
    height: 'calc(100vh - 370px)',
    width: '100%',
    color: '#fff',
    lineHeight: '20px',
    textAlign: 'center',
    background: '#364d79'
};

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
                    <Carousel autoplay autoplaySpeed={5000} effect="fade">
                        <div>
                            <img
                                style={contentStyle}
                                src={"https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"}
                            />
                        </div>
                        <div>
                            <img
                                style={contentStyle}
                                src={"https://ichef.bbci.co.uk/news/800/cpsprodpb/1572B/production/_88615878_976x1024n0037151.jpg"}
                            />
                        </div>
                        <div>
                            <img
                                style={contentStyle}
                                src={"https://asia.olympus-imaging.com/content/000107507.jpg"}
                            />
                        </div>
                        <div>
                            <img
                                style={contentStyle}
                                src={"https://cdn.pixabay.com/photo/2020/11/24/12/23/flowering-dogwood-5772385_1280.jpg"}
                            />
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
