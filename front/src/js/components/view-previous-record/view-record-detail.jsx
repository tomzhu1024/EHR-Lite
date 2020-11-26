import React from "react";
import { Descriptions, Badge } from "antd";

const style = {
    width: "fit-content",
    padding: 20,
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)"
}

function RecordDetail(props) {
  return (
    <>
    <div style={style}>
      <h2>Record</h2>
      <Descriptions style={{width: 800}} bordered>
        <Descriptions.Item label="Doctor" span={1}>
          {props.doctor}
        </Descriptions.Item>
        <Descriptions.Item label="Department" span={1}>
          {props.department}
        </Descriptions.Item>
        <Descriptions.Item label="Date" span={1}>
          {props.date}
        </Descriptions.Item>
        <Descriptions.Item label="Diagnosis" span={3}>
          {props.diagnosis}
        </Descriptions.Item>
        <Descriptions.Item label="Prescriptions" span={3}>
          {props.prescriptions}
        </Descriptions.Item>
      </Descriptions>
    </div>
    </>
  );
}

export default RecordDetail;
