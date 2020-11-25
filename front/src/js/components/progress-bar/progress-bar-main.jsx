import React from "react";
import BarImg from "./progress-bar-img";
import style from "../../../css/progress-bar-main.module.css";
import { Steps } from "antd";

const { Step } = Steps;

function returnImg() {
  let imgCom = [];
  const style1 = {
    "margin-top": "0px",
    width: "25%",
    float: "left"
  }
  const style2 = {
    "margin-top": "10px",
    width: "25%",
    float: "left"
  }
  for (let i = 0; i < 4; i++)
    imgCom.push(
      <div style={i === 0 ? style1 : style2} >
        <BarImg id={i}/>
      </div>
    );
  return imgCom;
}

function ProgressBar(props) {
  return (
    <div id={style["main"]}>
      <div id={style["title-wrapper"]}>
        <div id={style["title-text"]}><b>Status</b></div>
      </div>
      <div id={style["progress-img"]}>
        {returnImg()}
        <div className={style["clear-fix"]}></div>
      </div>
      <div id={style["step-bar"]}>
        <Steps current={props.current} style={{ width: 850 }}>
          <Step title="Reserve" />
          <Step title="Check In" />
          <Step title="See Doctor" />
          <Step title="Get Medicine" />
        </Steps>
      </div>
    </div>
  );
}

export default ProgressBar;