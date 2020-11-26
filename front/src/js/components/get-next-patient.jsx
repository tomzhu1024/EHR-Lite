import React from "react";
import { Card, Button } from "antd";
// import style from './get-next-patient.module.css'

const cardStyle = {
    width: 300,
    margin: "20px",
    "box-shadow": "0 0 20px rgba(0, 0, 0, 0.1)"
}

function NextPatient(props) {
  return (
    <Card title="Next Patient" bordered={false} style={cardStyle}>
      <h1>Liyu Chen</h1>
      <Button type="primary">Proceed</Button>
    </Card>
  );
}

export default NextPatient;
