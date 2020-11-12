import React from "react";
import { Calendar, List, Divider, Collapse } from "antd";
import "antd/dist/result.css";
import style from "../../css/calendar-form.module.css";

const { Panel } = Collapse;

function CalendarForm(props) {
  const data = [
    "9:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
  ];
  const doctors = ["Doctor Smith", "Doctor Wang", "Doctor Chen"];
  return (
    <div className={style["calendar-form-wrapper"]}>
      <div className={style["date-container"]}>
        <Calendar fullscreen={false} onSelect={onSelect} />
      </div>
      <Divider orientation="center">Available Slots</Divider>
      <div className={style["timeslots-container"]}>
        <Collapse bordered={false} defaultActiveKey={["1"]}>
          {data.map((e, i) => {
            return (
              <Panel header={e} key={i}>
                <p className={style["doctor-list"]}>{doctors[i]}</p>
              </Panel>
            );
          })}
        </Collapse>
      </div>
    </div>
  );
}

function callback(key) {
  console.log(key);
}

function onSelect(value, mode) {
  console.log(value, mode);
}

export default CalendarForm;
