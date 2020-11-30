import React from 'react';
import DepartmentList from "./department-list";
import CalendarForm from "./calendar-form";
import style from "../../../css/appointment.module.css"

function Appointment(props) {
  const departments = props.departments;
  const timeSlots = props.timeSlots;
  return (
    <div style={{height:"fit-content"}}>
      <div className={style["department-list"]}>
        <DepartmentList departments={departments}/>
      </div>
      <div className={style["calendar-form"]}>
        <CalendarForm timeSlots={timeSlots}/>
      </div>
      <div className={style["clear-fix"]}></div>
    </div>
  );
}

export default Appointment;