import React from "react";
import style from "../../css/patient-check-queue.module.css";
import { Card } from "antd";

function CheckQueue(props) {
  const ahead = props.ahead;
  return (
    <div id={style["card-wrapper"]}>
      <Card
        title="Queue Status"
        bordered={false}
        style={{ width: "20em", boxShadow: "0 0 2em rgba(0, 0, 0, 0.1)" }}
      >
        <div id={style["content-wrapper"]}>
          <div id={style["patient-order"]}>{ahead}</div>
          <h3 id={style["card-text"]}>
            <b>Patients ahead</b>
          </h3>
          <div className={style["clear-fix"]}></div>
          <p>Please maintain social distancing while waiting</p>
        </div>
      </Card>
    </div>
  );
}

export default CheckQueue;
