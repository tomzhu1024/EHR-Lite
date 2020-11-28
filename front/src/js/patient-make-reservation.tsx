import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Alert, Breadcrumb, Button, Card, DatePicker, Form, notification, Select, Space, Spin, Table} from "antd";
import {HomeOutlined, CalendarOutlined, PlusOutlined} from "@ant-design/icons";
import {IObservableArray, IObservableObject, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import $ from "jquery";

import {SERVER_ADDR} from "./misc/const";
import Style from "../css/patient-app-shared.module.less";

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
class PatientMakeReservation extends React.Component<RouteComponentProps, {}> {
    myState: {
        spinning: boolean;
        hasError: boolean;
        hasSuccess: boolean;
        message: string;
    } & IObservableObject = observable({
        spinning: false,
        hasError: false,
        hasSuccess: false,
        message: ''
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
                    <title>Make Reservation - EHR Lite</title>
                </Helmet>
                <Breadcrumb className={Style.breadcrumb}>
                    <Breadcrumb.Item>
                        <HomeOutlined/>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <CalendarOutlined/>
                        <span>My Reservation</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <PlusOutlined/>
                        <span>Add New</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Space direction="vertical" style={{width: "100%"}}>
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
                                className={Style.form}
                            >
                                <Select>
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
                                className={Style.form}
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
                                className={Style.form}
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
                                className={Style.tableAfterQuery}
                            >
                                <Table.Column<TimeSlot> key="doctorTitle" title="Doctor Title" dataIndex="doctorTitle"/>
                                <Table.Column<TimeSlot> key="doctorName" title="Doctor Name" dataIndex="doctorName"/>
                                <Table.Column<TimeSlot> key="startTime" title="Start Time" dataIndex="startTime"/>
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
                                                        this.myState.message = "Made reservation successfully!"
                                                    } else {
                                                        this.myState.hasError = true;
                                                        this.myState.message = "Failed to make reservation: " + data.error_message!;
                                                    }
                                                },
                                                error: () => {
                                                    this.myState.spinning = false;
                                                    notification["error"]({
                                                        message: "Server Error",
                                                        description: "Unable to make reservation."
                                                    });
                                                }
                                            });
                                        }}>Make Reservation</Button>
                                    )}
                                />
                            </Table>
                        </Card>
                    </Spin>
                </Space>
            </>
        );
    }
}

export {
    PatientMakeReservation
};
