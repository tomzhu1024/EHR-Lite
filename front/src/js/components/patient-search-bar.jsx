import React from "react";
import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

function PatientSearchBar(props) {
  return <Input placeholder="Patient ID" size="large" prefix={<UserOutlined />} />;
}

export default PatientSearchBar;