import React from "react";
import {Alert, Button, Card, Descriptions, Form, Input, notification, Space, Spin} from "antd";
import {Helmet} from "react-helmet";
import {SearchOutlined} from "@ant-design/icons";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import $ from "jquery";
import {SERVER_ADDR} from "../misc/const";
import Style from "../../css/staff/staff-shared.module.less";

@observer
class StaffFrontDesk extends React.Component<{}, {}> {
    myState: {
        spinning: boolean;
        hasResult: boolean;
        doctorName: string;
        department: string;
        date: string;
        startTime: string;
        endTime: string;
        stage: string;
        hasSuccess: boolean;
        hasError: boolean;
        message: string;
        patientId: string;
    } & IObservableObject = observable({
        spinning: false,
        hasResult: false,
        doctorName: '',
        department: '',
        date: '',
        startTime: '',
        endTime: '',
        stage: '',
        hasSuccess: false,
        hasError: false,
        message: '',
        patientId: '',
    });

    onFinish = (fieldsValue: any) => {
        this.myState.spinning = true;
        this.myState.hasResult = false;
        this.myState.hasSuccess = false;
        this.myState.hasError = false;
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/staff/front/searchPatient",
            crossDomain: true,
            xhrFields: {
                withCredentials: true,
            },
            dataType: "json",
            data: {
                id: fieldsValue.id!,
            },
            success: (data: any) => {
                this.myState.spinning = false;
                if (data.success!) {
                    this.myState.hasResult = true;
                    this.myState.doctorName = data.doctor_name!;
                    this.myState.department = data.department!;
                    this.myState.date = data.date!;
                    this.myState.startTime = data.start_time!;
                    this.myState.endTime = data.end_time!;
                    this.myState.stage = data.stage!;
                    this.myState.patientId = fieldsValue.id!;
                } else {
                    this.myState.hasError = true;
                    this.myState.message = data.error_message!;
                }
            },
            error: () => {
                this.myState.spinning = false;
                notification["error"]({
                    message: "Server Error",
                    description: "Unable to search patient.",
                });
            }
        });
    };

    onClick = () => {
        this.myState.spinning = true;
        this.myState.hasSuccess = false;
        this.myState.hasError = false;
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/staff/front/check-in",
            crossDomain: true,
            xhrFields: {
                withCredentials: true,
            },
            dataType: "json",
            data: {
                id: this.myState.patientId,
            },
            success: (data: any) => {
                this.myState.spinning = false;
                if (data.success!) {
                    this.myState.hasSuccess = true;
                    this.myState.hasResult = false;
                    this.myState.message = "Operation completed successfully!";
                } else {
                    this.myState.hasError = true;
                    this.myState.message = "Operation failed: " + data.error_message!;
                }
            },
            error: () => {
                this.myState.spinning = false;
                notification["error"]({
                    message: "Server Error",
                    description: "Unable to check-in patient.",
                });
            }
        });
    };

    render() {
        return (
            <>
                <Helmet>
                    <title>Front Desk - EHR Lite</title>
                </Helmet>
                <div className={Style.box}>
                    <Space direction="vertical">
                        <Spin spinning={this.myState.spinning}>
                            <Card>
                                <h1 className={Style.header}>Check In</h1>
                                <Form layout="inline" onFinish={this.onFinish}>
                                    <Form.Item
                                        label="Patient ID"
                                        name="id"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input patient ID!",
                                            },
                                        ]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            <SearchOutlined/>
                                            Search
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Spin>
                        {this.myState.hasResult ? (
                            <Spin spinning={this.myState.spinning}>
                                <Card>
                                    <Space direction="vertical">
                                        <Descriptions title="Patient Info" bordered>
                                            <Descriptions.Item span={24}
                                                label="Doctor Name">{this.myState.doctorName}</Descriptions.Item>
                                            <Descriptions.Item span={24}
                                                label="Department">{this.myState.department}</Descriptions.Item>
                                            <Descriptions.Item span={24}
                                                label="Date">{this.myState.date}</Descriptions.Item>
                                            <Descriptions.Item span={24}
                                                label="Stage">{this.myState.stage}</Descriptions.Item>
                                            <Descriptions.Item span={24}
                                                label="Start Time">{this.myState.startTime}</Descriptions.Item>
                                            <Descriptions.Item span={24}
                                                label="End Time">{this.myState.endTime}</Descriptions.Item>
                                        </Descriptions>
                                        <Button type="primary" onClick={this.onClick}>Check In</Button>
                                    </Space>
                                </Card>
                            </Spin>
                        ) : null}
                        {this.myState.hasSuccess ? (
                            <Alert
                                message="Operation Succeeded"
                                description={this.myState.message}
                                type="success"
                                showIcon
                            />
                        ) : null}
                        {this.myState.hasError ? (
                            <Alert
                                message="Operation Failed"
                                description={this.myState.message}
                                type="error"
                                showIcon
                            />
                        ) : null}
                    </Space>
                </div>
            </>
        );
    }

}

export {
    StaffFrontDesk
};
