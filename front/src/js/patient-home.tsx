import React, {CSSProperties} from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Breadcrumb, Card, Carousel, Collapse, Space, Spin, Steps} from "antd";
import {HistoryOutlined, HomeOutlined} from "@ant-design/icons";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import {v4 as uuidv4} from "uuid";

const { Step } = Steps;

const contentStyle: CSSProperties = {
    height: 'calc(100vh - 370px)',
    width: '100%',
    color: '#fff',
    lineHeight: '20px',
    textAlign: 'center',
    background: '#364d79',
};

@observer
class PatientHome extends React.Component<RouteComponentProps, {}> {
    myState: {
        spinning: boolean;
        currentStep: number;
    } & IObservableObject = observable({
        spinning: false,
        currentStep: 2,
    });

    render() {
        return (
            <>
                <Helmet>
                    <title>Home - EHR Lite</title>
                </Helmet>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <HomeOutlined/>
                        <span>Patient Home</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Space direction="vertical" style={{width: "100%", marginTop: "20px"}}>
                    <Carousel autoplay autoplaySpeed={5000} effect="fade">
                        <div>
                            <img style={contentStyle} src={"https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"}/>
                        </div>
                        <div>
                            <h3 style={contentStyle}>2</h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>3</h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>4</h3>
                        </div>
                    </Carousel>
                    <Spin spinning={this.myState.spinning}>
                        <Card>
                            <Steps
                                current={this.myState.currentStep}
                            >
                                <Step title="Make Reservation" description="Reserve a timeslot that works for you." onClick={() => {
                                    this.props.history.push("/makeReservation");
                                }}/>
                                <Step title="Queue" description="Wait in the queue." onClick={() => {
                                    this.props.history.push("/checkQueue");
                                }}/>
                                <Step title="Finish" description="Get the drug and all is done." onClick={() => {
                                    this.props.history.push("/checkHistory");
                                }}/>
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
