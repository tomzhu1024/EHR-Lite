import React from "react";
import { Descriptions, Badge } from "antd";
import { resetGlobalState } from "mobx/lib/internal";

const style = {
  // table cells are black without this background color property
  backgroundColor: "white",
  boxShadow: "0 0 2em rgba(0, 0, 0, 0.1)",
};

function ViewRecordDetail(props) {
  return (
    <>
      <div style={style}>
        <div>
          <h1>Medical Record</h1>
        </div>
        <Descriptions bordered>
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

export default ViewRecordDetail;
