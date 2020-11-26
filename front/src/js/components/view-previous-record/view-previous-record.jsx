import React from "react";
import { Table, Tag, Space } from "antd";

function ViewPreviousRecord(props) {
  const patientInfo = [
    {
      key: "1",
      Date: "2020-02-11",
      Department: "Brain and Cognitive Department",
    },
    { key: "2", Date: "2018-08-11", Department: "Heart Department" },
  ];

  const columns = [
    { title: "Date", dataIndex: "Date", key: "name" },
    { title: "Department", dataIndex: "Department", key: "age" },
  ];

  return (
    <Table
      dataSource={patientInfo}
      columns={columns}
      onRow={(record, rowIndex) => {
        return {
          onClick: () => {
              console.log(rowIndex);
          },
        };
      }}
      pagination={false}
      style={{
        marginLeft: "20px",
        marginTop: "20px",
        width: "770px",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
      }}
    />
  );
}

export default ViewPreviousRecord;
