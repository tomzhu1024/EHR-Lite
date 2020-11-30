import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {
    Alert,
    Breadcrumb,
    Button,
    Card,
    DatePicker,
    Form,
    notification,
    Result,
    Select,
    Space,
    Spin,
    Table
} from "antd";
import {HomeOutlined, ScheduleOutlined} from "@ant-design/icons";
import {IObservableArray, IObservableObject, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import $ from "jquery";

import {SERVER_ADDR} from "./misc/const";

interface TimeSlot {
    key: number;
    doctorId: number;
    doctorName: string;
    doctorTitle: string;
    scheduleId: number;
    startTime: string;
    endTime: string;
    date: string;
}

@observer
class PatientMakeAppointment extends React.Component<RouteComponentProps, {}> {
    myState: {
        spinning: boolean;
        hasError: boolean;
        hasSuccess: boolean;
        message: string;
        existAppointment: boolean;
        existAppointmentDate: string;
    } & IObservableObject = observable({
        spinning: false,
        hasError: false,
        hasSuccess: false,
        message: '',
        existAppointment: false,
        existAppointmentDate: '',
    });
    departmentList: Array<string> & IObservableArray<string> = observable([]);
    timeSlotData: Array<TimeSlot> & IObservableArray<TimeSlot> = observable([]);

    componentDidMount() {
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/patient/getDepartmentList",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: (data: any) => {
                if (data.success!) {
                    this.departmentList.clear();
                    data.data!.forEach((name: string) => {
                        this.departmentList.push(name);
                    });
                } else {
                    notification["error"]({
                        message: 'Server Error',
                        description: 'Unable to fetch department information.'
                    });
                }
            },
            error: () => {
                notification["error"]({
                    message: "Server Error",
                    description: 'Unable to fetch department information.'
                });
            }
        });
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/patient/currentAppointment",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: (data: any) => {
                if (data.has_appointment!) {
                    this.myState.existAppointment = true;
                    this.myState.existAppointmentDate = data.date!;
                } else {
                    this.myState.existAppointment = false;
                }
            },
            error: () => {
                notification['error']({
                    message: 'Server Error',
                    description: 'Unable to fetch records.'
                });
            }
        });
    }

    onFinish = (fieldsValue: any) => {
        this.myState.spinning = true;
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/patient/getSlots",
            dataType: "json",
            data: {
                department: fieldsValue.department!,
                date: fieldsValue.date!.format("YYYY-MM-DD")
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: (data: any) => {
                this.myState.spinning = false;
                if (data.success!) {
                    this.timeSlotData.clear();
                    data.data!.forEach((entry: any, index: number) => {
                        this.timeSlotData.push({
                            key: index,
                            doctorId: entry.doctor_id!,
                            doctorName: entry.name!,
                            doctorTitle: entry.title!,
                            scheduleId: entry.schedule_id!,
                            startTime: entry.start!,
                            endTime: entry.end!,
                            date: fieldsValue.date!.format("YYYY-MM-DD")
                        });
                    })
                } else {
                    notification["error"]({
                        message: "Server Error",
                        description: "Unable to fetch available time slots."
                    });
                }
            },
            error: () => {
                this.myState.spinning = false;
                notification["error"]({
                    message: "Server Error",
                    description: "Unable to fetch available time slots."
                });
            }
        })
    };

    render() {
        return (
            <>
                <Helmet>
                    <title>New Appointment - EHR Lite</title>
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
                        <span>Make New</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Space direction="vertical" style={{width: "100%", marginTop: "20px"}}>
                    {this.myState.existAppointment ? (
                        <Card>
                            <Result
                                status="info"
                                title={`You already have an appointment on ${this.myState.existAppointmentDate}.`}
                                subTitle="You are currently unable to make new appointment!"
                                extra={[
                                    <Button key="home" onClick={() => {
                                        this.props.history.push("/");
                                    }}>
                                        Go Home
                                    </Button>
                                ]}
                            />
                        </Card>
                    ) : (
                        <>
                            <Card>
                                <Form layout="inline" onFinish={this.onFinish}>
                                    <Form.Item
                                        label="Department"
                                        name="department"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please choose a department!"
                                            }
                                        ]}
                                        style={{marginBottom: "0"}}
                                    >
                                        <Select style={{minWidth: "150px"}}>
                                            {
                                                this.departmentList.map((name: string) => (
                                                    <Select.Option key={name} value={name}>{name}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name="date"
                                        label="Date"
                                        style={{marginBottom: "0"}}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select a date!"
                                            }
                                        ]}
                                    >
                                        <DatePicker/>
                                    </Form.Item>
                                    <Form.Item
                                        style={{marginBottom: "0"}}
                                    >
                                        <Button type="primary" htmlType="submit">
                                            Query
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                            {(this.myState.hasError || this.myState.hasSuccess) ? (
                                <Alert
                                    message={this.myState.message}
                                    type={this.myState.hasError ? "error" : "success"}
                                    showIcon
                                    closable
                                    afterClose={() => {
                                        this.myState.hasError = false;
                                        this.myState.hasSuccess = false;
                                    }}
                                />
                            ) : null}
                            <Spin spinning={this.myState.spinning}>
                                <Card>
                                    <Table<TimeSlot>
                                        size="middle"
                                        dataSource={toJS(this.timeSlotData)}
                                    >
                                        <Table.Column<TimeSlot> key="doctorTitle" title="Doctor Title"
                                                                dataIndex="doctorTitle"/>
                                        <Table.Column<TimeSlot> key="doctorName" title="Doctor Name"
                                                                dataIndex="doctorName"/>
                                        <Table.Column<TimeSlot> key="startTime" title="Start Time"
                                                                dataIndex="startTime"/>
                                        <Table.Column<TimeSlot> key="endTime" title="End Time" dataIndex="endTime"/>
                                        <Table.Column<TimeSlot>
                                            key="action"
                                            title="Action"
                                            render={(value: any, record: TimeSlot) => (
                                                <Button onClick={() => {
                                                    this.myState.spinning = true;
                                                    $.ajax({
                                                        type: "POST",
                                                        url: SERVER_ADDR + "/patient/appointment/reservation",
                                                        dataType: 'json',
                                                        data: {
                                                            schedule_id: record.scheduleId,
                                                            date: record.date,
                                                            doctor_id: record.doctorId
                                                        },
                                                        crossDomain: true,
                                                        xhrFields: {
                                                            withCredentials: true
                                                        },
                                                        success: (data: any) => {
                                                            this.myState.spinning = false;
                                                            this.myState.hasError = false;
                                                            this.myState.hasSuccess = false;
                                                            if (data.success!) {
                                                                this.myState.hasSuccess = true;
                                                                this.myState.message = "Made appointment successfully!"
                                                            } else {
                                                                this.myState.hasError = true;
                                                                this.myState.message = "Unable to make appointment: " + data.error_message!;
                                                            }
                                                        },
                                                        error: () => {
                                                            this.myState.spinning = false;
                                                            notification["error"]({
                                                                message: "Server Error",
                                                                description: "Unable to make appointment."
                                                            });
                                                        }
                                                    });
                                                }}>Make Appointment</Button>
                                            )}
                                        />
                                    </Table>
                                </Card>
                            </Spin>
                        </>
                    )}
                </Space>
            </>
        );
    }
}

export {
    PatientMakeAppointment
};
