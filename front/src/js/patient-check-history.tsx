import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Breadcrumb, Card, Collapse, Space, Spin} from "antd";
import {HistoryOutlined, HomeOutlined} from "@ant-design/icons";
import {IObservableObject, observable} from "mobx";
import {observer} from "mobx-react";
import {v4 as uuidv4} from "uuid";

const {Panel} = Collapse;

interface Record {
    doctorName: string;
    diagnosis: string;
    stage: string;
    drug: string;
}

@observer
class PatientCheckHistory extends React.Component<RouteComponentProps, {}> {
    myState: {
        spinning: boolean;
        records: Array<Record>;
    } & IObservableObject = observable({
        spinning: false,
        records: [
            {
                doctorName: 'sb',
                diagnosis: 'hello',
                stage: 'In Queue',
                drug: 'aspiring',
            },
            {
                doctorName: 'sb',
                diagnosis: 'hello',
                stage: 'In Queue',
                drug: 'aspiring',
            },
        ],
    });

    render() {
        return (
            <>
                <Helmet>
                    <title>All Records - EHR Lite</title>
                </Helmet>
                <Breadcrumb>
                    <Breadcrumb.Item>
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
                        <Card>
                            <Collapse accordion>
                                {this.myState.records.map((record: Record) => (
                                    <Panel header="Record" key={uuidv4()}>
                                        <h1>Stage</h1>
                                        <p>{record.stage}</p>
                                        <h1>Doctor Name</h1>
                                        <p>{record.doctorName}</p>
                                        <h1>Diagnosis</h1>
                                        <p>{record.diagnosis}</p>
                                        <h1>Drug</h1>
                                        <p>{record.drug}</p>
                                    </Panel>
                                ))}
                            </Collapse>
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
