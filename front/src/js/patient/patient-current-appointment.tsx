import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Breadcrumb, Button, Card, notification, Result, Space, Spin} from "antd";
import {HomeOutlined, ScheduleOutlined} from "@ant-design/icons";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import $ from "jquery";
import {SERVER_ADDR} from "../misc/const";

@observer
class FigureIcon extends React.Component<{ figure: number }, {}> {
    render() {
        return (
            <div
                style={{
                    height: "120px",
                    width: "120px",
                    border: "5px solid #09d0db",
                    borderRadius: "60px",
                    margin: "0 auto",
                }}
            >
                <span
                    style={{
                        fontSize: "90px",
                        lineHeight: "110px",
                        color: "#09d0db",
                        fontFamily: "Squada One"
                    }}
                >
                    {this.props.figure.toString()}
                </span>
            </div>
        );
    }
}

@observer
class PatientCurrentAppointment extends React.Component<RouteComponentProps, {}> {
    myState: {
        stage: number;
        appointmentDate: string;
        queuePosition: number;
        diagnosis: string;
        drug: string;
        spinning: boolean;
    } & IObservableObject = observable({
        stage: -1,
        appointmentDate: '',
        queuePosition: 0,
        diagnosis: '',
        drug: '',
        spinning: false,
    });
    timer: number;

    update = () => {
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
                        this.myState.stage = 0;
                    } else if (data.stage! === "Upcoming") {
                        $.ajax({
                            type: "GET",
                            url: SERVER_ADDR + "/patient/currentAppointment",
                            crossDomain: true,
                            xhrFields: {
                                withCredentials: true
                            },
                            success: (data: any) => {
                                this.myState.stage = 1;
                                if (data.has_appointment!) {
                                    this.myState.appointmentDate = data.date!;
                                }
                            },
                            error: () => {
                                notification['error']({
                                    message: 'Server Error',
                                    description: 'Unable to fetch records.'
                                });
                            }
                        });
                    } else if (data.stage! === "In Queue") {
                        $.ajax({
                            type: "GET",
                            url: SERVER_ADDR + "/patient/checkQueue",
                            crossDomain: true,
                            xhrFields: {
                                withCredentials: true
                            },
                            success: (data: any) => {
                                if (data.success!) {
                                    this.myState.stage = 2;
                                    this.myState.queuePosition = data.data!;
                                } else {
                                    notification["error"]({
                                        message: "Server Error",
                                        description: "Unable to fetch queue information."
                                    });
                                }
                            },
                            error: () => {
                                notification["error"]({
                                    message: "Server Error",
                                    description: "Unable to fetch queue information."
                                });
                            }
                        });
                    } else if (data.stage! === "In Progress") {
                        this.myState.stage = 3;
                    } else if (data.stage! === "Get Drug") {
                        $.ajax({
                            type: "GET",
                            url: SERVER_ADDR + "/patient/currentAppointment",
                            crossDomain: true,
                            xhrFields: {
                                withCredentials: true
                            },
                            success: (data: any) => {
                                this.myState.stage = 4;
                                if (data.has_appointment!) {
                                    this.myState.diagnosis = data.diagnosis!;
                                    this.myState.drug = data.drug!;
                                }
                            },
                            error: () => {
                                notification["error"]({
                                    message: "Server Error",
                                    description: "Unable to fetch queue information."
                                });
                            }
                        });
                    }
                } else {
                    notification["error"]({
                        message: "Server Error",
                        description: "Unable to fetch stage information."
                    });
                }
            },
            error: () => {
                this.myState.spinning = false;
                notification["error"]({
                    message: "Server Error",
                    description: "Unable to fetch stage information."
                });
            }
        });
    }

    componentDidMount() {
        this.myState.spinning = true;
        this.update();
        this.timer = window.setInterval(() => {
            this.update();
        }, 5000);
    }

    componentWillUnmount() {
        window.clearInterval(this.timer);
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Queue Status - EHR Lite</title>
                </Helmet>
                <Breadcrumb>
                    <Breadcrumb.Item href="#/">
                        <HomeOutlined/>
                        <span>Patient Home</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <ScheduleOutlined/>
                        <span>My Appointment</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>Check Current</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Space direction="vertical" style={{width: "100%", marginTop: "20px"}}>
                    <Spin spinning={this.myState.spinning}>
                        {this.myState.stage === -1 ? (
                            <Card>
                                <Result
                                    status="info"
                                    title="Loading..."
                                />
                            </Card>
                        ) : null}
                        {this.myState.stage === 0 ? (
                            <Card>
                                <Result
                                    status="error"
                                    title="You currently have no appointment."
                                    extra={[
                                        <Button key="makeAppointment" onClick={() => {
                                            this.props.history.push("/makeAppointment");
                                        }}>
                                            Make Appointment
                                        </Button>
                                    ]}
                                />
                            </Card>
                        ) : null}
                        {this.myState.stage === 1 ? (
                            <Card>
                                <Result
                                    status="success"
                                    title={`You have an appointment on ${this.myState.appointmentDate}!`}
                                />
                            </Card>
                        ) : null}
                        {this.myState.stage === 2 ? (
                            <Card>
                                <Result
                                    icon={<FigureIcon figure={this.myState.queuePosition}/>}
                                    title={`Wait a minute! You are in position ${this.myState.queuePosition}.`}
                                />
                            </Card>
                        ) : null}
                        {this.myState.stage === 3 ? (
                            <Card>
                                <Result
                                    status="info"
                                    title="Your doctor is still diagnosing..."
                                />
                            </Card>
                        ) : null}
                        {this.myState.stage === 4 ? (
                            <Card
                                style={{
                                    backgroundColor: "#ececec"
                                }}
                            >
                                <Card
                                    type="inner"
                                    title="Diagnosis"
                                    style={{
                                        width: "100%",
                                        maxWidth: "400px",
                                        minHeight: "200px",
                                        margin: "0 auto",
                                    }}
                                >
                                    {this.myState.diagnosis || "(Empty)"}
                                </Card>
                                <Card
                                    title="Drug"
                                    type='inner'
                                    style={{
                                        margin: "20px auto 0",
                                        width: "100%",
                                        maxWidth: "400px",
                                        minHeight: "200px",
                                    }}
                                >
                                    {this.myState.drug || "(Empty)"}
                                </Card>
                            </Card>
                        ) : null}
                    </Spin>
                </Space>
            </>
        );
    }
}

export {
    PatientCurrentAppointment
};
