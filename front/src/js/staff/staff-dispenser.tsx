import React from "react";
import {Alert, Button, Card, Descriptions, Form, Input, notification, Space, Spin} from "antd";
import {Helmet} from "react-helmet";
import {SearchOutlined} from "@ant-design/icons";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import $ from "jquery";
import {SERVER_ADDR} from "../misc/const";

@observer
class StaffDispenser extends React.Component<{}, {}> {
    myState: {
        spinning: boolean;
        hasResult: boolean;
        drug: string;
        hasSuccess: boolean;
        hasError: boolean;
        message: string;
        patientId: string;
    } & IObservableObject = observable({
        spinning: false,
        hasResult: false,
        drug: '',
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
            url: SERVER_ADDR + "/staff/dispenser/checkPrescription",
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
                    this.myState.drug = data.drug!;
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
            url: SERVER_ADDR + "/staff/dispenser/finishAppointment",
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
                    description: "Unable to finish appointment.",
                });
            }
        });
    };

    render() {
        return (
            <>
                <Helmet>
                    <title>Staff (Dispenser) - EHR Lite</title>
                </Helmet>
                <div style={{
                    margin: "30px auto 0",
                    maxWidth: "600px",
                    height: "100%",
                    padding: "30px"
                }}>
                    <Space direction="vertical">
                        <Spin spinning={this.myState.spinning}>
                            <Card>
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
                                        <Descriptions bordered>
                                            <Descriptions.Item label="Drug">{this.myState.drug || "(Empty)"}</Descriptions.Item>
                                        </Descriptions>
                                        <Button type="primary" onClick={this.onClick}>Finish</Button>
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
    StaffDispenser
};
