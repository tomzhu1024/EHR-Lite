import {observer} from "mobx-react";
import React from "react";
import $ from "jquery";
import {SERVER_ADDR} from "./misc/const";
import Style from "../css/patient-form.module.less";
import {Alert, Button, Card, DatePicker, Form, Input, Space, Spin} from "antd";
import {Link, RouteComponentProps} from "react-router-dom";
import {observable} from "mobx";
import {FormInstance} from 'antd/lib/form';
import {hash} from './misc/util';
import {Scrollbar} from "react-scrollbars-custom";

interface PatientRegisterPageState {
    hasError: boolean,
    errMsg: string,
    spinning: boolean
}

@observer
class PatientRegisterPage extends React.Component<RouteComponentProps, {}> {
    formRef = React.createRef<FormInstance>();
    myState: PatientRegisterPageState = observable({
        hasError: false,
        errMsg: '',
        spinning: false
    });

    componentDidMount() {
        $.ajax({
            type: "GET",
            url: SERVER_ADDR + "/isLogin",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: data => {
                if (data.is_login!) {
                    this.props.history.push("/patient/home");
                }
            }
        });
    }

    onFinish = (fieldsValue: any) => {
        this.myState.spinning = true;
        $.ajax({
            type: "POST",
            url: SERVER_ADDR + "/patient/register",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            data: {
                id: fieldsValue.id!,
                password: hash(fieldsValue.password!),
                name: fieldsValue.name!,
                birthday: fieldsValue.birthday!.format('YYYY-MM-DD')
            },
            success: (data: any) => {
                this.formRef.current.resetFields();
                this.myState.spinning = false;
                if (!data.success!) {
                    this.myState.hasError = true;
                    this.myState.errMsg = "Register Failed: " + data.error_message!;
                } else {
                    this.props.history.push('/patient/login');
                }
            },
            error: () => {
                this.myState.spinning = false;
                this.myState.hasError = true;
                this.myState.errMsg = "Register Failed: Server error";
            }
        });
    }

    render() {
        return (
            <>
                <div className={Style.gradient}/>
                <div className={Style.box}>
                    <Spin spinning={this.myState.spinning}>
                        <Card>
                            <Scrollbar noScrollX={true}>
                                <div  style={{height: "100vh"}}>
                                    <h1>Patient Registration</h1>
                                    <Form
                                        onFinish={this.onFinish}
                                        ref={this.formRef}
                                        layout="vertical"
                                        scrollToFirstError
                                    >
                                        <Form.Item
                                            name="id"
                                            label="ID"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your ID!',
                                                }
                                            ]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item
                                            name="name"
                                            label="Name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your nickname!', whitespace: true
                                                }
                                            ]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            label="Password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your password!',
                                                }
                                            ]}
                                            hasFeedback
                                        >
                                            <Input.Password/>
                                        </Form.Item>
                                        <Form.Item
                                            name={"confirm"}
                                            label="Confirm Password"
                                            dependencies={['password']}
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please confirm your password!',
                                                },
                                                ({getFieldValue}) => ({
                                                    validator(rule, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject('The two passwords that you entered do not match!');
                                                    },
                                                })
                                            ]}
                                        >
                                            <Input.Password/>
                                        </Form.Item>
                                        <Form.Item
                                            name="birthday"
                                            label="Birthday"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your birthday!'
                                                }
                                            ]}
                                        >
                                            <DatePicker/>
                                        </Form.Item>
                                        <Form.Item className={Style.rightAligned}>
                                            <Space>
                                                <Link to="/patient/login">Already have an account?</Link>
                                                <Button type="primary" htmlType="submit">
                                                    Register
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                        {this.myState.hasError ? (
                                            <Form.Item>
                                                <Alert
                                                    message={this.myState.errMsg}
                                                    type="error"
                                                    showIcon
                                                    closable
                                                    afterClose={() => {
                                                        this.myState.hasError = false;
                                                    }}
                                                />
                                            </Form.Item>
                                        ) : null}
                                    </Form>
                                </div>
                            </Scrollbar>
                        </Card>
                    </Spin>
                </div>
            </>
        )
    }
}

export {
    PatientRegisterPage
};
