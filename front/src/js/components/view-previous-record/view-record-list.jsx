import React from "react";
import { Table, Tag, Space } from "antd";

function ViewRecordList(props) {
  const patientInfo = props.patientInfo;
  const columns = [
    { title: "Date", dataIndex: "department", key: "date" },
    { title: "Department", dataIndex: "department", key: "department" },
  ];

  return (
    <Table
      dataSource={patientInfo}
      columns={columns}
      onRow={(record, rowIndex) => {
        return {
          onClick: () => {
            // fill in here the function to acquire detailed record
            console.log(record.date);
          },
        };
      }}
      pagination={false}
      style={{
        boxShadow: "0 0 1.5em rgba(0, 0, 0, 0.1)",
      }}
    />
  );
}

export default ViewRecordList;
