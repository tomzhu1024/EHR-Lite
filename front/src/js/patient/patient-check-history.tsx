import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Breadcrumb, Card, Collapse, Empty, notification, Space, Spin} from "antd";
import {HistoryOutlined, HomeOutlined} from "@ant-design/icons";
import {IObservableArray, IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import {v4 as uuidv4} from "uuid";
import $ from "jquery";
import {SERVER_ADDR} from "../misc/const";

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

@observer
class PatientCheckHistory extends React.Component<RouteComponentProps, {}> {
    myState: {
        spinning: boolean;
        records: Array<Record> & IObservableArray<Record>;
    } & IObservableObject = observable({
        spinning: false,
        records: observable([])
    });

    componentDidMount() {
        this.myState.spinning = true;
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/patient/getRecord",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: async (data: any) => {
                this.myState.spinning = false;
                if (data.success!) {
                    await Promise.all(data.data!.map(async (record: any) => {
                        this.myState.records.push({
                            date: record.date!,
                            appointments: await new Promise(resolve => {
                                $.ajax({
                                    type: "POST",
                                    url: SERVER_ADDR + "/patient/getAppointment",
                                    dataType: "json",
                                    data: {
                                        id: record.record_id!
                                    },
                                    crossDomain: true,
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    success: (data: any) => {
                                        if (data.success!) {
                                            resolve(
                                                data.data!.map((appointment: any) => ({
                                                    date: appointment.date!,
                                                    doctorName: appointment.doctor_name!,
                                                    diagnosis: appointment.diagnosis!,
                                                    stage: appointment.stage!,
                                                    drug: appointment.drug!,
                                                }))
                                            );
                                        } else {
                                            notification['error']({
                                                message: 'Server Error',
                                                description: 'Unable to fetch appointments.'
                                            });
                                        }
                                    },
                                    error: () => {
                                        this.myState.spinning = false;
                                        notification['error']({
                                            message: 'Server Error',
                                            description: 'Unable to fetch appointments.'
                                        });
                                    }
                                });
                            })
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
            }
        });
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>All Records - EHR Lite</title>
                </Helmet>
                <Breadcrumb>
                    <Breadcrumb.Item href="#/">
                        <HomeOutlined/>
                        <span>Patient Home</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <HistoryOutlined/>
                        <span>My History</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>All Records</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Space direction="vertical" style={{width: "100%", marginTop: "20px"}}>
                    <Spin spinning={this.myState.spinning}>
                        <Card style={{minHeight: "250px"}}>
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
                        </Card>
                    </Spin>
                </Space>
            </>
        );
    }
}

export {
    PatientCheckHistory
};
