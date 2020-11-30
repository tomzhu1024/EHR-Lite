import React from "react";
import {Helmet} from "react-helmet";
import {Button, Card, Collapse, Descriptions, Empty, Form, Input, List, notification, Result, Spin, Tabs} from "antd";
import {HistoryOutlined, UserOutlined} from '@ant-design/icons';
import {observer} from "mobx-react";
import {Scrollbar} from "react-scrollbars-custom";
import {v4 as uuidv4} from "uuid";
import {IObservableArray, IObservableObject, observable, toJS} from "mobx";
import $ from "jquery";

import {SERVER_ADDR} from "../misc/const";
import Style from "../../css/doctor/doctor-home.module.less"
import {FormInstance} from "antd/lib/form";

const {TabPane} = Tabs;
const {Panel} = Collapse;

interface Appointment {
    date: string,
    doctorName: string;
    diagnosis: string;
    stage: string;
    drug: string;
}

interface Record {
    date: string;
    appointments: Array<Appointment> & IObservableArray<Appointment>;
}

interface Patient {
    name: string;
    id: number;
}

@observer
class DoctorHome extends React.Component<{}, {}> {
    formRef = React.createRef<FormInstance>();

    myState: {
        spinning: boolean;
        stage: number;
        records: Array<Record> & IObservableArray<Record>;
        queue: Array<Patient> & IObservableArray<Patient>;
        patientName: string;
        patientId: number;
        appointmentId: number;
    } & IObservableObject = observable({
        spinning: false,
        stage: 1,
        records: observable([]),
        queue: observable([]),
        patientName: '',
        patientId: 0,
        appointmentId: 0,
    });

    componentDidMount() {
        this.updateQueue();
    }

    updateQueue = () => {
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/doctor/getQueue",
            crossDomain: true,
            xhrFields: {
                withCredentials: true,
            },
            success: (data: any) => {
                if (data.success!) {
                    this.myState.queue.replace(
                        data.queue!.map((entry: any) => ({
                            name: entry.name!,
                            id: entry.patient_id!,
                        })));
                } else {
                    notification["error"]({
                        message: "Server Error",
                        description: "Fetch queue failed: " + data.error_message!,
                    });
                }
            },
            error: () => {
                notification["error"]({
                    message: "Server Error",
                    description: "Unable to fetch queue information.",
                });
            }
        });
    };

    getNextPatient = () => {
        $.ajax()
    };

    onFinish = (fieldsValue: any) => {

    };

    render() {
        return (
            <>
                <Helmet>
                    <title>Doctor Home - EHR Lite</title>
                </Helmet>
                <div className={Style.mainPanel}>
                    <Spin spinning={this.myState.spinning}>
                        <Card>
                            <div className={Style.leftSubPanel}>
                                {this.myState.stage === 0 ? (
                                    <Card>
                                        <Result
                                            status="info"
                                            title="There is no ongoing diagnosis."
                                        />
                                    </Card>
                                ) : (
                                    <>
                                        <Scrollbar noScrollX={true}>
                                            <Descriptions title="Current Patient Info" bordered size="small">
                                                <Descriptions.Item
                                                    label="Name">{this.myState.patientName}</Descriptions.Item>
                                                <Descriptions.Item label="ID">
                                                    {this.myState.patientId}</Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Appointment ID">{this.myState.appointmentId}</Descriptions.Item>
                                            </Descriptions>
                                            <Tabs defaultActiveKey="1">
                                                <TabPane
                                                    tab={
                                                        <span>
                                                      <UserOutlined/>
                                                      Diagnosis
                                                    </span>
                                                    }
                                                    key="1"
                                                >
                                                    {this.myState.stage === 1 ? (
                                                        <Form layout="vertical" ref={this.formRef}
                                                              onFinish={this.onFinish}>
                                                            <Form.Item name="diagnosis" label="Diagnosis">
                                                                <Input.TextArea/>
                                                            </Form.Item>
                                                            <Form.Item name="drug" label="Drug">
                                                                <Input.TextArea/>
                                                            </Form.Item>
                                                            <Form.Item>
                                                                <Button type="primary" htmlType="submit">
                                                                    Submit
                                                                </Button>
                                                            </Form.Item>
                                                        </Form>
                                                    ) : (
                                                        <Card>
                                                            <Result
                                                                status="success"
                                                                title="You have submitted your diagnosis."
                                                            />
                                                        </Card>
                                                    )}
                                                </TabPane>
                                                <TabPane
                                                    tab={
                                                        <span>
                                                      <HistoryOutlined/>
                                                      History Records
                                                    </span>
                                                    }
                                                    key="2"
                                                    style={{
                                                        height: "100%"
                                                    }}
                                                >
                                                    {this.myState.records.length > 0 ? (
                                                        <>
                                                            {this.myState.records.map((record: Record) => (
                                                                <Collapse
                                                                    key={uuidv4()}
                                                                    style={{marginBottom: "15px"}}
                                                                >
                                                                    <Panel
                                                                        key={uuidv4()}
                                                                        header={'Record'}
                                                                        extra={<span>{record.date}</span>}
                                                                    >
                                                                        {record.appointments.map((appointment: Appointment) => (
                                                                            <Card
                                                                                key={uuidv4()}
                                                                                title="Appointment"
                                                                                extra={
                                                                                    <span>{appointment.date}</span>}
                                                                            >
                                                                                <h1>Stage</h1>
                                                                                <p>{appointment.stage}</p>
                                                                                <h1>Doctor Name</h1>
                                                                                <p>{appointment.doctorName}</p>
                                                                                <h1>Diagnosis</h1>
                                                                                <p>{appointment.diagnosis || "(Empty)"}</p>
                                                                                <h1>Drug</h1>
                                                                                <p>{appointment.drug || "(Empty)"}</p>
                                                                            </Card>
                                                                        ))}
                                                                    </Panel>
                                                                </Collapse>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                                                    )}
                                                </TabPane>
                                            </Tabs>
                                        </Scrollbar>
                                    </>
                                )}
                            </div>
                            <div className={Style.rightSubPanel}>
                                <h1>
                                    Current In Queue: {this.myState.queue.length} people
                                </h1>
                                <Button type="primary">Get Next Patient</Button>
                                <Card>
                                    <Scrollbar noScrollX={true}>
                                        {this.myState.queue.length > 0 ? (
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={toJS(this.myState.queue)}
                                                renderItem={(patient: Patient) => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            avatar={<UserOutlined/>}
                                                            title={patient.name}
                                                            description={`ID: ${patient.id.toString()}`}
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        ) : (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                                        )}
                                    </Scrollbar>
                                </Card>
                            </div>
                        </Card>
                    </Spin>
                </div>
            </>
        );
    }
}

export {
    DoctorHome
};
