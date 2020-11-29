import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Breadcrumb, Button, Card, notification, Result, Space, Spin} from "antd";
import {HomeOutlined, ScheduleOutlined} from "@ant-design/icons";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import $ from "jquery";
import {SERVER_ADDR} from "./misc/const";

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
class PatientCheckQueue extends React.Component<RouteComponentProps, {}> {
    myState: {
        isInQueue: boolean;
        position: number;
        spinning: boolean;
    } & IObservableObject = observable({
        isInQueue: true,
        position: 10,
        spinning: false
    });
    timer: number;

    update = () => {
        this.myState.spinning = true;
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/patient/checkQueue",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: (data: any) => {
                this.myState.spinning = false;
                if (data.success!) {
                    this.myState.isInQueue = true;
                    this.myState.position = data.data!;
                } else {
                    this.myState.isInQueue = false;
                }
            },
            error: () => {
                this.myState.spinning = false;
                notification["error"]({
                    message: "Server Error",
                    description: "Unable to fetch queue information."
                });
            }
        });
    }

    componentDidMount() {
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
                        <span>Queue Status</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Space direction="vertical" style={{width: "100%", marginTop: "20px"}}>
                    <Spin spinning={this.myState.spinning}>
                        <Card>
                            {this.myState.isInQueue ? (
                                <Result
                                    icon={<FigureIcon figure={this.myState.position}/>}
                                    title={`Wait a minute! You are in position ${this.myState.position}.`}
                                    subTitle="This page will refresh automatically..."
                                />
                            ) : (
                                <Result
                                    status="info"
                                    title="You are not in the queue!"
                                    subTitle={'You should check-in at the front-desk in-person.'}
                                    extra={[
                                        <Button key="home" onClick={() => {
                                            this.props.history.push("/");
                                        }}>
                                            Go Home
                                        </Button>
                                    ]}
                                />
                            )}
                        </Card>
                    </Spin>
                </Space>
            </>
        );
    }
}

export {
    PatientCheckQueue
};
