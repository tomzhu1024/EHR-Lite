import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Breadcrumb, Button, Card, Result, Space, Spin} from "antd";
import {HomeOutlined, ScheduleOutlined} from "@ant-design/icons";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";

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
        spinning: true
    });
    timer: number;

    update = () => {
        this.myState.isInQueue = true;
        this.myState.position = Math.trunc(Math.random() * 20);
    }

    componentDidMount() {
        this.update();
        this.timer = window.setInterval(() => {
            this.update();
        }, 5000);
    }

    componentWillUnmount() {
        console.log('clearing timer');
        window.clearInterval(this.timer);
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Queue Status - EHR Lite</title>
                </Helmet>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <HomeOutlined/>
                        <span>Patient Home</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <ScheduleOutlined/>
                        <span>My Reservation</span>
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
                                    title={`Please wait for a while! You are currently at position ${this.myState.position}.`}
                                    subTitle="This page will refresh automatically..."
                                />
                            ) : (
                                <Result
                                    status="info"
                                    title="You are not in any queue!"
                                    subTitle={''}
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
