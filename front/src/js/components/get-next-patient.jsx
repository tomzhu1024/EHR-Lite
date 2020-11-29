import React from "react";
import { Card, Button } from "antd";
 
const cardStyle = {
    width: "20em",
    boxShadow: "0 0 2em rgba(0, 0, 0, 0.1)"
}

function NextPatient(props) {
  return (
    <Card title="Next Patient" bordered={false} style={cardStyle}>
      <h1>{props.name}</h1>
      <Button type="primary" onClick={() => {
        console.log("button clicked");
      }}>Proceed</Button>
    </Card>
  );
}

export default NextPatient;
