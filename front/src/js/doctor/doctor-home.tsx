import React from "react";
import {Helmet} from "react-helmet";
import {
    Button,
    Card,
    Collapse,
    Descriptions,
    Empty,
    Form,
    Input,
    List,
    notification,
    Result,
    Space,
    Spin,
    Tabs
} from "antd";
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
    department: string;
    diagnosis: string;
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
        stage: 0,
        records: observable([]),
        queue: observable([]),
        patientName: '',
        patientId: 0,
        appointmentId: 0,
    });

    updateQueue = async () => {
        return await new Promise(resolve => {
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
                            message: "Operation Failed",
                            description: data.error_message!,
                        });
                    }
                    resolve();
                },
                error: () => {
                    notification["error"]({
                        message: "Server Error",
                        description: "Unable to fetch queue information.",
                    });
                    resolve();
                }
            });
        });
    };

    fetchHistoryRecords = async () => {
        return await new Promise(resolve => {
            $.ajax({
                type: "POST",
                url: SERVER_ADDR + "/doctor/getRecord",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                data: {
                    patient_id: this.myState.patientId,
                },
                success: async (data: any) => {
                    if (data.success!) {
                        await Promise.all(data.data!.map(async (record: any) => {
                            this.myState.records.push({
                                date: record.date!,
                                appointments: await new Promise(resolve => {
                                    $.ajax({
                                        type: "POST",
                                        url: SERVER_ADDR + "/doctor/getRecordDetail",
                                        dataType: "json",
                                        data: {
                                            patient_id: this.myState.patientId,
                                            record_id: record.record_id!,
                                        },
                                        crossDomain: true,
                                        xhrFields: {
                                            withCredentials: true
                                        },
                                        success: (data: any) => {
                                            this.myState.spinning = false;
                                            if (data.success!) {
                                                resolve(
                                                    data.data!.map((appointment: any) => ({
                                                        date: appointment.date!,
                                                        doctorName: appointment.doctor_name!,
                                                        department: appointment.department!,
                                                        diagnosis: appointment.diagnosis!,
                                                        drug: appointment.drug!,
                                                    }))
                                                );
                                            } else {
                                                notification['error']({
                                                    message: 'Server Error',
                                                    description: 'Unable to fetch appointments.'
                                                });
                                            }
                                            resolve();
                                        },
                                        error: () => {
                                            this.myState.spinning = false;
                                            notification['error']({
                                                message: 'Server Error',
                                                description: 'Unable to fetch appointments.'
                                            });
                                            resolve();
                                        }
                                    });
                                }),
                            })
                        }));
                        this.myState.records.replace(
                            this.myState.records.slice().sort((a, b) =>
                                a.date > b.date ? -1 : 1)
                        );
                        this.myState.records.map((record: Record) => {
                            record.appointments.replace(
                                record.appointments.slice().sort((a, b) =>
                                    a.date > b.date ? -1 : 1)
                            );
                        });
                    } else {
                        notification['error']({
                            message: 'Server Error',
                            description: 'Unable to fetch records.'
                        });
                    }
                },
                error: () => {
                    this.myState.spinning = false;
                    notification['error']({
                        message: 'Server Error',
                        description: 'Unable to fetch records.'
                    });
                    resolve();
                }
            });
        });
    };

    getNextPatient = () => {
        this.myState.spinning = true;
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/doctor/nextAppointment",
            crossDomain: true,
            xhrFields: {
                withCredentials: true,
            },
            success: (data: any) => {
                if (data.success!) {
                    this.myState.patientName = data.name!;
                    this.myState.patientId = data.patient_id!;
                    this.myState.appointmentId = data.appointment_id!;
                    this.myState.stage = 1;
                    Promise.all([
                        this.updateQueue(),
                        this.fetchHistoryRecords(),
                    ]).then(() => {
                        this.myState.spinning = false;
                    });
                } else {
                    this.myState.spinning = false;
                    notification["error"]({
                        message: "Operation Failed",
                        description: data.error_message!,
                    });
                }
            },
            error: () => {
                this.myState.spinning = false;
                notification["error"]({
                    message: "Server Error",
                    description: "Unable to fetch next patient information",
                });
            },
        });
    };

    onFinish = (fieldsValue: any) => {
        this.myState.spinning = true;
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/doctor/submitDiagnosis",
            crossDomain: true,
            xhrFields: {
                withCredentials: true,
            },
            dataType: "json",
            data: {
                appointment_id: this.myState.appointmentId,
                diagnosis: fieldsValue.diagnosis || '',
                drug: fieldsValue.drug || '',
            },
            success: (data: any) => {
                this.myState.spinning = false;
                if (data.success!) {
                    this.myState.stage = 0;
                } else {
                    notification["error"]({
                        message: "Operation Failed",
                        description: data.error_message!,
                    });
                }
            },
            error: () => {
                this.myState.spinning = false;
                notification["error"]({
                    message: "Server Error",
                    description: "Unable to submit diagnosis.",
                });
            },
        });
    };

    componentDidMount() {
        this.updateQueue().then();
    }

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
                                            <Card>
                                                <Descriptions
                                                    title="Current Patient Info"
                                                    bordered
                                                >
                                                    <Descriptions.Item label="Name">
                                                        {this.myState.patientName}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="ID">
                                                        {this.myState.patientId}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item
                                                        label="Appointment ID">{this.myState.appointmentId}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Card>
                                            <Card className={Style.leftLower}>
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
                                                        <Form layout="vertical" ref={this.formRef}
                                                              onFinish={this.onFinish}>
                                                            <Form.Item
                                                                name="diagnosis"
                                                                label="Diagnosis"
                                                            >
                                                                <Input.TextArea/>
                                                            </Form.Item>
                                                            <Form.Item
                                                                name="drug"
                                                                label="Drug"
                                                            >
                                                                <Input.TextArea/>
                                                            </Form.Item>
                                                            <Form.Item>
                                                                <Button type="primary" htmlType="submit">
                                                                    Submit
                                                                </Button>
                                                            </Form.Item>
                                                        </Form>
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
                                                                                    <h1>Department</h1>
                                                                                    <p>{appointment.department}</p>
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
                                            </Card>
                                        </Scrollbar>
                                    </>
                                )}
                            </div>
                            <div className={Style.rightSubPanel}>
                                <Card>
                                    <h1>
                                        Current In Queue: {this.myState.queue.length} people
                                    </h1>
                                    <Space>
                                        <Button
                                            type="primary"
                                            onClick={this.getNextPatient}
                                            disabled={this.myState.stage === 1}
                                        >Get Next Patient</Button>
                                        <Button
                                            onClick={this.updateQueue}
                                        >Refresh</Button>
                                    </Space>
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
